"""A small JSON-backed task store."""

import json
from pathlib import Path


def list_tasks(store: Path) -> list[dict]:
    if not store.exists():
        return []
    return json.loads(store.read_text(encoding="utf-8"))


def add_task(store: Path, title: str) -> dict:
    tasks = list_tasks(store)
    task = {"id": max((item["id"] for item in tasks), default=0) + 1,
            "title": title, "done": False}
    tasks.append(task)
    store.write_text(json.dumps(tasks, indent=2) + "\n", encoding="utf-8")
    return task
