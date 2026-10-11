"""Behavior tests for DevThread's local scripts."""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "skill" / "devthread" / "scripts"
FIXTURES = ROOT / "tests" / "fixtures"


def run_script(name: str, target: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SCRIPTS / name), str(target), *args],
        text=True, capture_output=True, check=False,
    )


def task_text(task_id: str, *, status: str = "backlog", deps: str = "[]",
              requirements: str = "[]") -> str:
    return f"""---
id: {task_id}
title: "Task {task_id}"
status: {status}
priority: medium
depends_on: {deps}
requirements: {requirements}
---

## Goal

Goal.

## Scope

Scope.

## Acceptance Criteria

- An observable result.

## Relevant Files

Unknown.

## Evidence

No checks recorded.

## Notes/Blockers

None.
"""


class ScriptTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory(dir=ROOT)
        self.addCleanup(self.temp.cleanup)
        self.target = Path(self.temp.name) / "project"
        self.target.mkdir()

    def initialize(self) -> None:
        result = run_script("init.py", self.target)
        self.assertEqual(result.returncode, 0, result.stderr)

    def write_task(self, task_id: str, **kwargs: str) -> None:
        (self.target / ".devthread" / "tasks" / f"{task_id}.md").write_text(
            task_text(task_id, **kwargs), encoding="utf-8"
        )

    def test_dry_run_and_repeat_init_preserve_files(self) -> None:
        dry = run_script("init.py", self.target, "--dry-run")
        self.assertEqual(dry.returncode, 0, dry.stderr)
        self.assertFalse((self.target / ".devthread").exists())
        self.initialize()
        self.assertTrue((self.target / ".devthread" / "tasks" / ".gitkeep").is_file())
        self.assertTrue((self.target / ".devthread" / "reports" / ".gitkeep").is_file())
        project = self.target / ".devthread" / "PROJECT.md"
        project.write_text("# My own project\n", encoding="utf-8")
        again = run_script("init.py", self.target)
        self.assertEqual(again.returncode, 0, again.stderr)
        self.assertEqual(project.read_text(encoding="utf-8"), "# My own project\n")
        self.assertEqual(run_script("validate.py", self.target).returncode, 0)

    def test_relative_current_directory_target(self) -> None:
        init = subprocess.run([sys.executable, str(SCRIPTS / "init.py"), "."],
                              cwd=self.target, text=True, capture_output=True, check=False)
        self.assertEqual(init.returncode, 0, init.stderr)
        validate = subprocess.run([sys.executable, str(SCRIPTS / "validate.py"), "."],
                                  cwd=self.target, text=True, capture_output=True, check=False)
        self.assertEqual(validate.returncode, 0, validate.stderr)
        status = subprocess.run([sys.executable, str(SCRIPTS / "status.py"), ".", "--json"],
                                cwd=self.target, text=True, capture_output=True, check=False)
        self.assertEqual(status.returncode, 0, status.stderr)

    def test_preexisting_state_keeps_user_bytes_and_fills_gaps(self) -> None:
        shutil.copytree(FIXTURES / "preexisting", self.target, dirs_exist_ok=True)
        protected = [self.target / "AGENTS.md", self.target / ".devmap" / "config.json",
                     self.target / ".devmap" / "PROJECT.md",
                     self.target / ".devmap" / "tasks" / "TASK-001.md"]
        original = {path: path.read_bytes() for path in protected}
        self.initialize()
        self.assertTrue((self.target / ".devmap" / "ARCHITECTURE.md").exists())
        self.assertFalse((self.target / ".devthread").exists())
        self.assertEqual({path: path.read_bytes() for path in protected}, original)
        self.assertEqual(run_script("validate.py", self.target).returncode, 0)

    def test_status_recovers_legacy_state_without_changing_it(self) -> None:
        self.initialize()
        self.write_task("TASK-001", status="done")
        self.write_task("TASK-002", status="ready", deps="[TASK-001]")
        before = run_script("status.py", self.target, "--json")
        state = self.target / ".devthread"
        legacy = self.target / ".devmap"
        state.rename(legacy)
        saved = {path: path.read_bytes() for path in legacy.rglob("*") if path.is_file()}
        self.assertEqual(run_script("validate.py", self.target).returncode, 0)
        after = run_script("status.py", self.target, "--json")
        self.assertEqual(after.returncode, 0, after.stderr)
        self.assertEqual(json.loads(before.stdout), json.loads(after.stdout))
        self.assertEqual({path: path.read_bytes() for path in saved}, saved)
        self.assertFalse(state.exists())

    def test_two_state_paths_are_refused_without_writes(self) -> None:
        self.initialize()
        legacy = self.target / ".devmap"
        legacy.mkdir()
        (legacy / "PROJECT.md").write_text("# Legacy project\n", encoding="utf-8")
        before = {path: path.read_bytes() for path in self.target.rglob("*") if path.is_file()}
        for script, args in (("init.py", ("--dry-run",)), ("init.py", ()),
                             ("validate.py", ()), ("status.py", ("--json",))):
            with self.subTest(script=script, args=args):
                result = run_script(script, self.target, *args)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("both .devthread and .devmap", result.stderr)
                self.assertEqual({path: path.read_bytes() for path in self.target.rglob("*")
                                  if path.is_file()}, before)

    def test_legacy_file_cannot_be_bypassed_by_new_initialization(self) -> None:
        legacy = self.target / ".devmap"
        legacy.write_bytes(b"existing user data")
        result = run_script("init.py", self.target)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(legacy.read_bytes(), b"existing user data")
        self.assertFalse((self.target / ".devthread").exists())

    def test_init_refuses_malformed_existing_state(self) -> None:
        self.initialize()
        config = self.target / ".devthread" / "config.json"
        config.write_text('{"schemaVersion": 99}\n', encoding="utf-8")
        result = run_script("init.py", self.target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("unsupported schemaVersion", result.stderr)
        self.assertEqual(config.read_text(encoding="utf-8"), '{"schemaVersion": 99}\n')

    def test_validate_rejects_malformed_frontmatter(self) -> None:
        self.initialize()
        path = self.target / ".devthread" / "tasks" / "TASK-001.md"
        path.write_text("---\nid: TASK-001\n", encoding="utf-8")
        result = run_script("validate.py", self.target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("closing frontmatter", result.stderr)

    def test_validate_rejects_invalid_id_and_missing_requirement(self) -> None:
        self.initialize()
        self.write_task("TASK-001", requirements="[REQ-999]")
        result = run_script("validate.py", self.target)
        self.assertIn("missing requirement REQ-999", result.stderr)
        path = self.target / ".devthread" / "tasks" / "TASK-001.md"
        path.write_text(path.read_text(encoding="utf-8").replace("id: TASK-001", "id: BAD-001"), encoding="utf-8")
        result = run_script("validate.py", self.target)
        self.assertIn("invalid task ID", result.stderr)

    def test_validate_rejects_duplicate_and_malformed_requirements(self) -> None:
        self.initialize()
        requirements = self.target / ".devthread" / "REQUIREMENTS.md"
        requirements.write_text("# Requirements\n\n## REQ-001: One\n\n## REQ-001: Two\n\n## REQ-XYZ: Bad\n", encoding="utf-8")
        result = run_script("validate.py", self.target)
        self.assertIn("duplicate requirement ID REQ-001", result.stderr)
        self.assertIn("malformed requirement heading", result.stderr)

    def test_validate_rejects_missing_dependency_and_cycle(self) -> None:
        self.initialize()
        self.write_task("TASK-001", deps="[TASK-999]")
        result = run_script("validate.py", self.target)
        self.assertIn("missing dependency TASK-999", result.stderr)
        self.write_task("TASK-001", deps="[TASK-002]")
        self.write_task("TASK-002", deps="[TASK-001]")
        result = run_script("validate.py", self.target)
        self.assertIn("dependency cycle: TASK-001 -> TASK-002 -> TASK-001", result.stderr)

    def test_ready_requires_done_dependencies(self) -> None:
        self.initialize()
        self.write_task("TASK-001", status="in_progress")
        self.write_task("TASK-002", status="ready", deps="[TASK-001]")
        result = run_script("validate.py", self.target)
        self.assertIn("unfinished dependencies", result.stderr)

    def test_status_counts_and_prioritizes_eligible_tasks(self) -> None:
        self.initialize()
        self.write_task("TASK-001", status="done")
        self.write_task("TASK-002", status="ready", deps="[TASK-001]")
        self.write_task("TASK-003", status="backlog")
        path = self.target / ".devthread" / "tasks" / "TASK-003.md"
        path.write_text(path.read_text(encoding="utf-8").replace("status: backlog", "status: ready")
                        .replace("priority: medium", "priority: high"), encoding="utf-8")
        result = run_script("status.py", self.target, "--json")
        self.assertEqual(result.returncode, 0, result.stderr)
        data = json.loads(result.stdout)
        self.assertEqual(data["counts"]["done"], 1)
        self.assertEqual(data["counts"]["ready"], 2)
        self.assertEqual([task["id"] for task in data["eligible"]], ["TASK-003", "TASK-002"])


if __name__ == "__main__":
    unittest.main()
