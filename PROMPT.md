# Gantt Chart Web App Requirements

I want a Next.js project that implements a Gantt chart web app with the following:

## Core Gantt Functionality

1. Interactive Gantt chart with real date ranges working correctly (start/end dates).

2. Drag and drop ability for tasks — moving and resizing bars should update dates in UI.

3. Modal UI to add/edit tasks (title, start date, end date, assignee, optional progress).

4. Visual task bars with labels and timeline.

## Agent Feature

5. An "Agent" button that automatically adjusts overlapping tasks (or suggests schedule fixes) — at minimum pushes tasks forward to resolve conflicts.

## Real‑World Project Management Features (impress stakeholders / users)

6. Dependencies: support defining task dependencies (e.g., finish‑to‑start). Optionally show arrows or indicators.
7. Progress visualization: show percent complete inside task bars.
8. Responsiveness: basic layout adapts to browser size.

## UX / UI Expectations

9. Clean, responsive chart layout with a top timeline and a task list on the left.
10. Modals for creating/editing tasks — date pickers, input validation.
11. Save tasks in memory (no backend required for POC), but build architecture so backend can be added later.

## Bonus Enhancements (optional but valuable)

- Task color coding (e.g., by owner or status).
- Zoom levels (day / week / month).
- Export view to PDF or image.

## Deliverables should include:

- Next.js code files with clear folder structure.
- Instructions to run locally.
- Comments explaining drag/drop integration and agent logic.

## 🧠 Why This Prompt Matters (Real‑World Justification)

Modern Gantt tools used by teams and enterprises include features like:

- Drag‑and‑drop editing of tasks on the timeline.
- Dependencies between tasks to maintain sequence logic.
- Progress and milestones for visibility of work status.
- Multiple project views, collaboration, and real‑time updates for shared team use.

Even if your POC doesn't implement everything, planning for them in the prompt communicates seriousness and a roadmap beyond MVP
