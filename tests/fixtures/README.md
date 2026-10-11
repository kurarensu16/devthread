# Repository fixtures

- `empty/` represents an empty target directory. `.gitkeep` exists only so Git can track it; remove that marker when copying the fixture into a test target.
- `typical/` is a small Python application with no DevThread state.
- `preexisting/` contains project instructions and user-authored, partially populated legacy `.devmap/` state from the original name. Initialization must add only missing files in that directory and preserve every existing byte.
- `taskboard/` is an existing JSON-backed application for the Milestone 3 workflow exercise. It deliberately lacks its planned completion operation.

Tests must copy fixtures to a temporary directory before invoking scripts that mutate them.
