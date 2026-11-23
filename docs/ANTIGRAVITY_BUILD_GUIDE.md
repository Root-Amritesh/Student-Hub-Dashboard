# Antigravity Build Guide — UniDesk Student Hub

## 1. Prompt entry point

The authoritative master prompt for Antigravity is `docs/ANTIGRAVITY_MASTER_PROMPT.md`.

## 2. Build steps

1. Read every file in `docs/` before writing code.
2. Create `.nojekyll`, `assets/img/unidesk-logo.svg`, `index.html`, `assets/css/styles.css` (Flexbox, no Grid).
3. Build `DEFAULT_COLLEGE_TIMETABLE`, storage wrapper, local date helper, ID generator, seed logic in `assets/js/app.js`.
4. Implement Tasks + Dashboard; Timetable + Notes + Resources; Focus + Audio + Preferences.
5. Test at desktop (1280 px), tablet (768 px), mobile (375 px).

## 3. Code ownership per teammate

- Amritesh Kumar: shell, navigation, preferences, dashboard render, deployment packaging.
- Naved Ali: stylesheet + focus/audio module.
- Aryan Chahal: tasks + resources module.
- Tanishk Singh: timetable + attendance + notes module.

## 4. Notes for the team

- Replace `DEFAULT_COLLEGE_TIMETABLE` contents with the real Bennett routine when available.
- Drop personal royalty-free MP3s into `assets/audio/`.
- Keep all state under `unidesk.v1.*`.
