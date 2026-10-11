"""Validate DevThread version 1 project state."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from _state import validate_state


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("target", type=Path, help="project directory")
    args = parser.parse_args()
    errors, tasks = validate_state(Path(os.path.abspath(args.target)).resolve())
    if errors:
        for error in errors:
            print(f"error: {error}", file=sys.stderr)
        return 1
    print(f"Valid DevThread v1 state: {len(tasks)} task(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
