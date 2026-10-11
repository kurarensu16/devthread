"""Show factual task counts and dependency-valid next tasks."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from _state import STATUSES, eligible_tasks, validate_state


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("target", type=Path, help="project directory")
    parser.add_argument("--json", action="store_true", help="emit machine-readable JSON")
    args = parser.parse_args()
    errors, tasks = validate_state(Path(os.path.abspath(args.target)).resolve())
    if errors:
        for error in errors:
            print(f"error: {error}", file=sys.stderr)
        return 1
    counts = {status: sum(task.status == status for task in tasks.values()) for status in STATUSES}
    eligible = eligible_tasks(tasks)
    if args.json:
        print(json.dumps({"schemaVersion": 1, "total": len(tasks), "counts": counts,
                          "eligible": [{"id": task.id, "title": task.title,
                                        "priority": task.priority} for task in eligible]}, indent=2))
    else:
        print(f"Tasks: {len(tasks)}")
        for status, count in counts.items():
            print(f"  {status}: {count}")
        print("Eligible next tasks:")
        for task in eligible:
            print(f"  {task.id} [{task.priority}] {task.title}")
        if not eligible:
            print("  none")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
