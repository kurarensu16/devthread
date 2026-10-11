# Requirements

## REQ-001: Repository-native skill and safe local state

The skill can initialize new and existing repositories without overwriting files, validate versioned task state, and report factual status. Automated checks cover repeat initialization, invalid state, dependencies, and cycles.

## REQ-002: Evidence-based workflows and context recovery

The skill supports understand, map, reconcile, next, implement, verify, and status with facts separated from inferences. Evidence levels and verification outcomes are recorded. A fresh agent session can read saved `.devthread/` context and identify a justified next task.

## REQ-003: Public landing page and documentation

A responsive, accessible landing page and documentation explain the working skill, installation, formats, workflows, troubleshooting, privacy, and tested compatibility. Commands and links are checked. The GitHub link uses a real configured repository URL.

## REQ-004: Release readiness

CI, clean-install checks, and an end-to-end sample pass. Claims match observed evidence. Release and publication occur only after approval.

## REQ-005: Portable npm installation

The user-approved npm package bundles the complete skill and a Node installer using built-in modules. Project, global, custom-directory, and dry-run options support Windows, Linux, and macOS paths. Existing installations are preserved. OS checks and package contents are verified where hosts are available, with remaining checks recorded honestly. Registry publication requires separate approval.
