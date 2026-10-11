# Map and next

Read the current `.devthread/` state and the relevant repository evidence. Define requirements in `REQUIREMENTS.md`, milestones in `ROADMAP.md`, and tasks in `tasks/`. Give each task a stable ID, acceptance criteria, priority, requirements, and dependencies. Allocate the next numeric ID after the largest existing ID; do not reuse old IDs. Record assumptions and preserve approved decisions. Run `validate.py` after editing.

For `next`, use `status.py` for dependency-valid ready tasks. Recommend the highest-priority eligible task, with numeric ID as the tie break, and explain why its evidence and dependencies make it appropriate. If none qualifies, report why. Do not change task status merely by recommending it.
