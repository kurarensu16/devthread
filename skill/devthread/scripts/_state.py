"""Read and validate DevThread version 1 state without third-party dependencies."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

SCHEMA_VERSION = 1
STATE_DIRECTORY = ".devthread"
LEGACY_STATE_DIRECTORY = ".devmap"
TASK_ID = re.compile(r"TASK-[0-9]{3,}\Z")
REQ_ID = re.compile(r"REQ-[0-9]{3,}\Z")
REQ_HEADING = re.compile(r"^## (REQ-[0-9]{3,}): .+$")
STATUSES = ("backlog", "ready", "in_progress", "blocked", "review", "done")
PRIORITIES = ("low", "medium", "high")
SECTIONS = (
    "Goal", "Scope", "Acceptance Criteria", "Relevant Files", "Evidence",
    "Notes/Blockers",
)
DOCUMENTS = (
    "PROJECT.md", "REQUIREMENTS.md", "ARCHITECTURE.md", "ROADMAP.md",
    "DECISIONS.md",
)


@dataclass(frozen=True)
class Task:
    path: Path
    id: str
    title: str
    status: str
    priority: str
    depends_on: tuple[str, ...]
    requirements: tuple[str, ...]


def _read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8-sig")
    except (OSError, UnicodeError) as exc:
        raise ValueError(f"{path}: cannot read UTF-8 text: {exc}") from exc


def _frontmatter_value(value: str, path: Path, key: str) -> str | list[str]:
    if value.startswith('"') or value.startswith("["):
        try:
            parsed = json.loads(value)
        except json.JSONDecodeError as exc:
            if value.startswith("[") and value.endswith("]"):
                items = [item.strip() for item in value[1:-1].split(",")]
                if items != [""] and all(re.fullmatch(r"[A-Za-z0-9_-]+", item) for item in items):
                    return items
            raise ValueError(f"{path}: invalid {key}: {exc.msg}") from exc
        if isinstance(parsed, str):
            return parsed
        if isinstance(parsed, list) and all(isinstance(item, str) for item in parsed):
            return parsed
        raise ValueError(f"{path}: {key} must be a string or array of strings")
    if not value or ":" in value or "#" in value:
        raise ValueError(f"{path}: quote {key} as a JSON string")
    return value


def parse_task(path: Path) -> Task:
    lines = _read(path).splitlines()
    if not lines or lines[0] != "---":
        raise ValueError(f"{path}: missing opening frontmatter delimiter")
    try:
        end = lines.index("---", 1)
    except ValueError as exc:
        raise ValueError(f"{path}: missing closing frontmatter delimiter") from exc
    fields: dict[str, str | list[str]] = {}
    for line in lines[1:end]:
        if not line or line.lstrip() != line or ":" not in line:
            raise ValueError(f"{path}: malformed frontmatter line: {line!r}")
        key, value = line.split(":", 1)
        if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]*", key):
            raise ValueError(f"{path}: invalid frontmatter key: {key!r}")
        if key in fields:
            raise ValueError(f"{path}: duplicate frontmatter key: {key}")
        fields[key] = _frontmatter_value(value.strip(), path, key)

    for key in ("id", "title", "status", "priority", "depends_on", "requirements"):
        if key not in fields:
            raise ValueError(f"{path}: missing frontmatter field: {key}")
    for key in ("id", "title", "status", "priority"):
        if not isinstance(fields[key], str) or not fields[key].strip():
            raise ValueError(f"{path}: {key} must be a nonempty string")
    for key in ("depends_on", "requirements"):
        if not isinstance(fields[key], list):
            raise ValueError(f"{path}: {key} must be an inline array of strings")
        if len(fields[key]) != len(set(fields[key])):
            raise ValueError(f"{path}: duplicate values in {key}")

    task_id = fields["id"]
    if not TASK_ID.fullmatch(task_id):
        raise ValueError(f"{path}: invalid task ID: {task_id}")
    if path.stem != task_id:
        raise ValueError(f"{path}: filename and task ID differ")
    if fields["status"] not in STATUSES:
        raise ValueError(f"{path}: invalid status: {fields['status']}")
    if fields["priority"] not in PRIORITIES:
        raise ValueError(f"{path}: invalid priority: {fields['priority']}")
    for dep in fields["depends_on"]:
        if not TASK_ID.fullmatch(dep):
            raise ValueError(f"{path}: invalid dependency ID: {dep}")
    for req in fields["requirements"]:
        if not REQ_ID.fullmatch(req):
            raise ValueError(f"{path}: invalid requirement ID: {req}")

    headings = re.findall(r"^## (.+?)\s*$", "\n".join(lines[end + 1:]), re.MULTILINE)
    for section in SECTIONS:
        if headings.count(section) != 1:
            raise ValueError(f"{path}: expected one '## {section}' section")
    return Task(
        path, task_id, fields["title"], fields["status"], fields["priority"],
        tuple(fields["depends_on"]), tuple(fields["requirements"]),
    )


def state_directory(target: Path) -> Path:
    current = target / STATE_DIRECTORY
    legacy = target / LEGACY_STATE_DIRECTORY
    current_exists = current.exists() or current.is_symlink()
    legacy_exists = legacy.exists() or legacy.is_symlink()
    if current_exists and legacy_exists:
        raise ValueError(
            f"{target}: both {STATE_DIRECTORY} and {LEGACY_STATE_DIRECTORY} state paths exist; "
            "review them before continuing"
        )
    return legacy if legacy_exists else current


def validate_state(target: Path, *, require_complete: bool = True) -> tuple[list[str], dict[str, Task]]:
    errors: list[str] = []
    tasks: dict[str, Task] = {}
    try:
        state = state_directory(target)
    except ValueError as exc:
        return [str(exc)], tasks
    if state.is_symlink() or (state / "tasks").is_symlink() or (state / "reports").is_symlink():
        return [f"{state}: linked state directories are unsupported"], tasks
    if not state.is_dir():
        return ([f"{state}: directory is missing"] if require_complete else []), tasks

    config = state / "config.json"
    if config.exists():
        try:
            data = json.loads(_read(config))
            if not isinstance(data, dict) or type(data.get("schemaVersion")) is not int:
                errors.append(f"{config}: schemaVersion must be an integer")
            elif data["schemaVersion"] != SCHEMA_VERSION:
                errors.append(f"{config}: unsupported schemaVersion {data['schemaVersion']}")
        except (ValueError, json.JSONDecodeError) as exc:
            errors.append(f"{config}: invalid JSON: {exc}")
    elif require_complete:
        errors.append(f"{config}: file is missing")

    for name in DOCUMENTS:
        path = state / name
        if require_complete and not path.is_file():
            errors.append(f"{path}: file is missing")
    for name in ("tasks", "reports"):
        path = state / name
        if require_complete and not path.is_dir():
            errors.append(f"{path}: directory is missing")

    requirements: set[str] = set()
    req_file = state / "REQUIREMENTS.md"
    if req_file.is_file():
        try:
            for line_number, line in enumerate(_read(req_file).splitlines(), 1):
                if line.startswith("## REQ-"):
                    match = REQ_HEADING.fullmatch(line)
                    if match is None:
                        errors.append(f"{req_file}:{line_number}: malformed requirement heading")
                        continue
                    req_id = match.group(1)
                    if req_id in requirements:
                        errors.append(f"{req_file}: duplicate requirement ID {req_id}")
                    requirements.add(req_id)
        except ValueError as exc:
            errors.append(str(exc))

    task_dir = state / "tasks"
    if task_dir.is_dir():
        for path in sorted(task_dir.glob("*.md")):
            try:
                task = parse_task(path)
            except ValueError as exc:
                errors.append(str(exc))
                continue
            if task.id in tasks:
                errors.append(f"{path}: duplicate task ID {task.id}")
            tasks[task.id] = task

    for task in tasks.values():
        for req in task.requirements:
            if req not in requirements:
                errors.append(f"{task.path}: missing requirement {req}")
        for dep in task.depends_on:
            if dep not in tasks:
                errors.append(f"{task.path}: missing dependency {dep}")
            elif dep == task.id:
                errors.append(f"{task.path}: self-dependency {dep}")
        if task.status == "ready":
            unfinished = [dep for dep in task.depends_on if dep in tasks and tasks[dep].status != "done"]
            if unfinished:
                errors.append(f"{task.path}: ready task has unfinished dependencies: {', '.join(unfinished)}")

    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(task_id: str, path: list[str]) -> None:
        if task_id in visited:
            return
        if task_id in visiting:
            cycle = path[path.index(task_id):]
            message = f"dependency cycle: {' -> '.join(cycle)}"
            if message not in errors:
                errors.append(message)
            return
        visiting.add(task_id)
        for dep in tasks[task_id].depends_on:
            if dep in tasks:
                visit(dep, path + [dep])
        visiting.remove(task_id)
        visited.add(task_id)

    for task_id in sorted(tasks):
        visit(task_id, [task_id])
    return errors, tasks


def eligible_tasks(tasks: dict[str, Task]) -> list[Task]:
    rank = {"high": 0, "medium": 1, "low": 2}
    return sorted(
        (task for task in tasks.values() if task.status == "ready"
         and all(tasks[dep].status == "done" for dep in task.depends_on)),
        key=lambda task: (rank[task.priority], int(task.id.split("-")[1])),
    )
