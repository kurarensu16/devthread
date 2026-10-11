"""Safely initialize a repository with DevThread version 1 state."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from _state import DOCUMENTS, LEGACY_STATE_DIRECTORY, SCHEMA_VERSION, state_directory, validate_state


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("target", type=Path, help="existing project directory")
    parser.add_argument("--dry-run", action="store_true", help="show additions without writing")
    args = parser.parse_args()
    target = Path(os.path.abspath(args.target)).resolve()
    if not target.is_dir():
        print(f"error: target is not a directory: {target}", file=sys.stderr)
        return 2

    try:
        state = state_directory(target)
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    if state.is_symlink():
        print(f"error: linked state directory is unsupported: {state}", file=sys.stderr)
        return 2
    if state.exists() and not state.is_dir():
        print(f"error: {state} exists but is not a directory", file=sys.stderr)
        return 2
    if state.exists():
        errors, _ = validate_state(target, require_complete=False)
        if errors:
            for error in errors:
                print(f"error: {error}", file=sys.stderr)
            return 1

    if state.name == LEGACY_STATE_DIRECTORY:
        print(f"Using existing legacy state: {state}")

    templates = Path(__file__).resolve().parent.parent / "templates"
    files = {state / "config.json": json.dumps({"schemaVersion": SCHEMA_VERSION}, indent=2) + "\n"}
    for name in DOCUMENTS:
        files[state / name] = (templates / name).read_text(encoding="utf-8")
    files[state / "tasks" / ".gitkeep"] = ""
    files[state / "reports" / ".gitkeep"] = ""
    directories = (state, state / "tasks", state / "reports")
    for directory in directories:
        if directory.exists() and not directory.is_dir():
            print(f"error: {directory} exists but is not a directory", file=sys.stderr)
            return 2
        if not directory.exists():
            print(f"CREATE {directory}/")
            if not args.dry_run:
                directory.mkdir()
    for path, content in files.items():
        if path.exists():
            print(f"KEEP   {path}")
            continue
        print(f"CREATE {path}")
        if not args.dry_run:
            try:
                with path.open("x", encoding="utf-8", newline="\n") as output:
                    output.write(content)
            except FileExistsError:
                print(f"error: {path} appeared during initialization", file=sys.stderr)
                return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
