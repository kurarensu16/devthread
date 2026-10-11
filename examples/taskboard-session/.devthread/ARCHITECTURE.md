# Architecture

## Observed Structure

`src/taskboard.py` provides functions that read and write a JSON list of task records. `tests/` contains standard-library `unittest` checks. The manifest declares Python 3.10 or later. `AGENTS.md` constrains storage and dependencies.

## Inferences

No concurrency behavior is specified or tested. The implementation may be unsuitable for concurrent writers; that is not a claim of an observed failure.
