# Product Requirements Document (PRD) — UniDesk Student Hub

## 1. Purpose

UniDesk ("One calm place for your college day") consolidates a first-semester B.Tech CSE student's daily academic workflow — classes, assignments, notes, reference bookmarks and study sessions — into **one responsive, offline-first web app** built with HTML5, CSS3 and vanilla ES6+.

Course: **2026FSWD100** · Bennett University · Dr. Himanshu Sharma · four-member team (Amritesh Kumar, Naved Ali, Aryan Chahal, Tanishk Singh).

## 2. Problem

First-year engineering students juggle fragmented tools: PDF timetables in chat apps, scattered sticky notes, browser bookmark bars and ad-heavy streaming tabs. Existing solutions are either heavy productivity suites with cloud accounts or single-purpose tools. UniDesk targets the specific Sem-1 B.Tech CSE routine with a **calm, structured, zero-backend** workspace.

## 3. Scope (out of scope)

- No backend APIs, no accounts, no cloud sync, no push notifications, no ERP scraping.
- All persistence is browser-local under `unidesk.v1.*` keys.

## 4. Functional requirements

### FR-01 — Dashboard
- Time-aware greeting using saved display name + local date.
- Four KPI tiles: Open Tasks, Tasks Due Today, Completion Rate (`<progress>`), Today's Attendance.
- Today's classes sorted by startTime with click/double-click attendance.
- Up to five overdue/upcoming tasks.
- Royal-blue Focus Mode hero → jump to `#sec-focus`.

### FR-02 — Tasks
- Fields: title (required, 2–100 chars), subject (required), dueDate (required YYYY-MM-DD), priority (high/medium/low), optional description.
- CRUD + checkbox toggle with unique string IDs.
- Filters: All, Today, Upcoming, Completed, Overdue. Live search across title/subject/description. Sort: Due Date, Priority, Recently Added.
- Inline validation feedback via `aria-live="polite"` error slots.

### FR-03 — Timetable & Attendance
- `DEFAULT_COLLEGE_TIMETABLE` (Mon–Sat) preloaded; Restore Default Routine.
- Custom periods: subject, code, day, start/end, room, instructor, type; end > start; no same-day overlaps; back-to-back allowed.
- Single-click Present / double-click Absent; 240 ms click timer cancelled by dblclick.
- P/A/Clear micro-buttons for keyboard/mobile access.
- Semantic `<table>` ledger: Present, Absent, Total Marked, %, Shortage (< configurable target).

### FR-04 — Notes
- CRUD; title, optional subject, 5 pastel swatches, body; search; snippet preview; updatedAt.

### FR-05 — Resources
- Seeds: MDN Web Docs, GitHub Pages Quickstart, OWASP Top Ten, W3C Accessibility.
- URL validation via `new URL()` allowing only `http:` / `https:`; anchors with `target="_blank" rel="noopener noreferrer"`.

### FR-06 — Focus & Study Audio
- Focus timer: 15:00 Sprint, 25:00 Focus, 45:00 Deep Work; Start/Pause/Reset.
- `<audio id="study-audio" controls loop preload="metadata">` with 3 local tracks, picker, loop toggle, volume slider, play/pause sync, graceful error handling; never autoplay.

### FR-07 — Preferences
- Display name, Light/Dark theme, attendance target; Reset requires confirmed dialog and removes only `unidesk.v1.*` keys.

## 5. Acceptance criteria summary

- Zero console errors on load and across all module flows.
- Zero horizontal scroll at 375 px.
- No dead controls.
- No innerHTML with user data.
- No UTC-based local date keys.
- No autoplay before user gesture.

## 6. Future scope

- Real college timetable paste-in.
- Backup export of `unidesk.v1.*` data.
