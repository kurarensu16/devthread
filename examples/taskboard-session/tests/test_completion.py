import tempfile
import unittest
from pathlib import Path

from src.taskboard import add_task, complete_task, list_tasks

PROJECT = Path(__file__).resolve().parents[1]


class CompletionTests(unittest.TestCase):
    def test_complete_preserves_id_and_other_tasks(self):
        with tempfile.TemporaryDirectory(dir=PROJECT) as directory:
            store = Path(directory) / "tasks.json"
            first = add_task(store, "Write docs")
            second = add_task(store, "Review docs")

            completed = complete_task(store, first["id"])

            self.assertEqual(completed["id"], first["id"])
            self.assertTrue(completed["done"])
            self.assertEqual(list_tasks(store), [completed, second])

    def test_unknown_id_does_not_change_storage(self):
        with tempfile.TemporaryDirectory(dir=PROJECT) as directory:
            store = Path(directory) / "tasks.json"
            add_task(store, "Write docs")
            before = store.read_bytes()

            with self.assertRaisesRegex(ValueError, "unknown task ID: 99"):
                complete_task(store, 99)

            self.assertEqual(store.read_bytes(), before)
