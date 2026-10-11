"""Reproducible local workflow exercise for new and existing repositories.

This verifies files and scripts across fresh processes. It does not evaluate an
agent's natural-language decisions or automatic skill discovery.
"""

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
FIXTURE = ROOT / "tests" / "fixtures" / "taskboard"


def command(*args: str, cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, cwd=cwd, text=True, capture_output=True, check=False)


def cli(script: str, target: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return command(sys.executable, str(SCRIPTS / script), str(target), *args)


class WorkflowScenarios(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory(dir=ROOT)
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)

    def test_new_repository_initialization(self) -> None:
        project = self.base / "new-project"
        project.mkdir()
        self.assertEqual(cli("init.py", project, "--dry-run").returncode, 0)
        self.assertFalse((project / ".devthread").exists())
        self.assertEqual(cli("init.py", project).returncode, 0)
        self.assertEqual(cli("validate.py", project).returncode, 0)
        status = cli("status.py", project, "--json")
        self.assertEqual(status.returncode, 0, status.stderr)
        self.assertEqual(json.loads(status.stdout)["total"], 0)

    def test_existing_application_plan_reconcile_implement_verify_resume(self) -> None:
        project = self.base / "taskboard"
        shutil.copytree(FIXTURE, project, ignore=shutil.ignore_patterns("__pycache__"))
        self.assertTrue((project / "AGENTS.md").is_file())
        baseline = command(sys.executable, "-m", "unittest", "discover", "-s", "tests", "-v", cwd=project)
        self.assertEqual(baseline.returncode, 0, baseline.stderr)
        self.assertEqual(cli("init.py", project).returncode, 0)
        state = project / ".devthread"

        # Understand and map: record observed app capabilities, a missing
        # requirement, stable tasks, and an explicit dependency.
        (state / "PROJECT.md").write_text(
            "# Project\n\nJSON-backed task store. Add/list behavior observed in source and tests.\n"
            "Completion behavior is planned and currently absent.\n", encoding="utf-8")
        (state / "ARCHITECTURE.md").write_text(
            "# Architecture\n\nObserved: src/taskboard.py reads and writes a JSON list.\n"
            "Inference: no concurrency guarantees are documented.\n", encoding="utf-8")
        (state / "REQUIREMENTS.md").write_text(
            "# Requirements\n\n## REQ-001: Add and list tasks\n\n"
            "A task can be stored and listed.\n\n"
            "## REQ-002: Complete a task\n\n"
            "An existing task can be marked done without changing its ID.\n", encoding="utf-8")
        (state / "ROADMAP.md").write_text(
            "# Roadmap\n\n## Milestone 1\n\nTASK-001: existing add/list behavior.\n"
            "TASK-002: implement completion after TASK-001.\n", encoding="utf-8")
        (state / "tasks" / "TASK-001.md").write_text(
            task("TASK-001", "Add and list tasks", "done", "[]", "[REQ-001]",
                 "verified: src/taskboard.py; python -m unittest discover -s tests -v passed (2 tests)."),
            encoding="utf-8")
        second = state / "tasks" / "TASK-002.md"
        second.write_text(task("TASK-002", "Complete a task", "ready", "[TASK-001]",
                               "[REQ-002]", "missing: bounded search of src/taskboard.py found no completion operation."),
                          encoding="utf-8")
        self.assertEqual(cli("validate.py", project).returncode, 0)

        # Next: the only dependency-valid ready task is TASK-002.
        status = cli("status.py", project, "--json")
        self.assertEqual(status.returncode, 0, status.stderr)
        self.assertEqual([item["id"] for item in json.loads(status.stdout)["eligible"]], ["TASK-002"])

        # Define an acceptance check first, observe failure, implement in the
        # temporary copy, then verify. The fixture itself stays unchanged.
        feature_test = project / "tests" / "test_completion.py"
        feature_test.write_text(
            "import tempfile\nimport unittest\nfrom pathlib import Path\n"
            "from src.taskboard import add_task, complete_task, list_tasks\n\n"
            "class CompletionTests(unittest.TestCase):\n"
            "    def test_complete_preserves_id(self):\n"
            "        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parents[1]) as directory:\n"
            "            store = Path(directory) / 'tasks.json'\n"
            "            original = add_task(store, 'Write docs')\n"
            "            result = complete_task(store, original['id'])\n"
            "            self.assertEqual(result['id'], original['id'])\n"
            "            self.assertTrue(result['done'])\n"
            "            self.assertEqual(list_tasks(store), [result])\n",
            encoding="utf-8")
        check_args = (sys.executable, "-m", "unittest", "discover", "-s", "tests", "-v")
        before = command(*check_args, cwd=project)
        self.assertNotEqual(before.returncode, 0)
        self.assertIn("cannot import name 'complete_task'", before.stderr)

        implementation = project / "src" / "taskboard.py"
        with implementation.open("a", encoding="utf-8") as output:
            output.write(
                "\n\ndef complete_task(store: Path, task_id: int) -> dict:\n"
                "    tasks = list_tasks(store)\n"
                "    for item in tasks:\n"
                "        if item['id'] == task_id:\n"
                "            item['done'] = True\n"
                "            store.write_text(json.dumps(tasks, indent=2) + '\\n', encoding='utf-8')\n"
                "            return item\n"
                "    raise ValueError(f'unknown task ID: {task_id}')\n"
            )
        after = command(*check_args, cwd=project)
        self.assertEqual(after.returncode, 0, after.stderr)
        self.assertIn("Ran 3 tests", after.stderr)
        report = state / "reports" / "TASK-002-verification.md"
        report.write_text(
            "# TASK-002 verification\n\n"
            "- Command: `python -m unittest discover -s tests -v`\n"
            "- Before implementation: failed (missing `complete_task` import).\n"
            "- After implementation: passed (3 tests).\n"
            "- Limit: tests cover completion and ID preservation; no concurrent writes tested.\n",
            encoding="utf-8")
        second.write_text(task("TASK-002", "Complete a task", "review", "[TASK-001]",
                               "[REQ-002]", "verified: completion test passed; see reports/TASK-002-verification.md."),
                          encoding="utf-8")

        # A fresh process can recover the saved task state and report. This
        # is a process-level resume check, not a new agent-session check.
        self.assertEqual(cli("validate.py", project).returncode, 0)
        resumed = cli("status.py", project, "--json")
        self.assertEqual(resumed.returncode, 0, resumed.stderr)
        data = json.loads(resumed.stdout)
        self.assertEqual(data["counts"]["review"], 1)
        self.assertEqual(data["counts"]["done"], 1)
        self.assertEqual(data["eligible"], [])
        self.assertIn("passed (3 tests)", report.read_text(encoding="utf-8"))


def task(task_id: str, title: str, status: str, deps: str, reqs: str, evidence: str) -> str:
    return f"""---
id: {task_id}
title: "{title}"
status: {status}
priority: medium
depends_on: {deps}
requirements: {reqs}
---

## Goal

{title}.

## Scope

The JSON-backed task store.

## Acceptance Criteria

- The named behavior works under a relevant test.

## Relevant Files

src/taskboard.py

## Evidence

- Assessment: {evidence}

## Notes/Blockers

None.
"""


if __name__ == "__main__":
    unittest.main()
