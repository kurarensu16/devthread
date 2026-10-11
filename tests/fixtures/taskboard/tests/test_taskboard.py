import tempfile
import unittest
from pathlib import Path

from src.taskboard import add_task, list_tasks

PROJECT = Path(__file__).resolve().parents[1]


class TaskboardTests(unittest.TestCase):
    def test_add_and_list(self):
        with tempfile.TemporaryDirectory(dir=PROJECT) as directory:
            store = Path(directory) / "tasks.json"
            first = add_task(store, "Write tests")
            second = add_task(store, "Review output")
            self.assertEqual([first["id"], second["id"]], [1, 2])
            self.assertEqual(list_tasks(store), [first, second])

    def test_missing_store_is_empty(self):
        with tempfile.TemporaryDirectory(dir=PROJECT) as directory:
            self.assertEqual(list_tasks(Path(directory) / "tasks.json"), [])
