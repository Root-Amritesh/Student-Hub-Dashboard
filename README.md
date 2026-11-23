# UniDesk — Student Hub
**"One calm place for your college day"**

UniDesk is a **zero-dependency, client-side student productivity web application** engineered exclusively with **HTML5, CSS3, and vanilla ES6+ JavaScript** for the first-semester B.Tech CSE Web Development mini-project (**2026FSWD100**) at Bennett University.

Built by the four-member fresher team ahead of the **November 27, 2026 LMS deadline**:

| Member | Role | Ownership |
|---|---|---|
| **Amritesh Kumar** | Team Leader | Semantic `index.html`, `#sec-*` bookmark navigation, Preferences / Theme / Reset (`unidesk.v1.*`), `renderDashboard()`, GitHub Pages & ZIP packaging |
| **Naved Ali** | Frontend / Audio | `assets/css/styles.css` (box model, 5 CSS position rules, Flexbox, Light/Dark contrast, 375 px mobile nav) + **06. Focus & Study Audio** |
| **Aryan Chahal** | Logic / Security | **02. Tasks** (CRUD, search, filters, sort, JS validation) + **05. Resources** (URL check, `rel="noopener noreferrer"`, seeds) |
| **Tanishk Singh** | Timetable / Notes | **03. Timetable & Attendance** (`DEFAULT_COLLEGE_TIMETABLE`, overlap math, click/dblclick, `<table>` ledger) + **04. Notes** |

---

## What was built

Six connected modules plus Preferences:

1. **01. Dashboard (`#sec-dashboard`)** — Time-aware greeting with saved display name, four Bento KPI tiles (Open Tasks, Tasks Due Today, Completion Rate with `<progress>`, Today's Attendance), today's classes sorted by start time, overdue/upcoming tasks, royal-blue Focus Mode hero.
2. **02. Tasks (`#sec-tasks`)** — Full CRUD with unique string IDs, inline JS validation (title 2–100 chars, subject, due date `YYYY-MM-DD`), five filter chips, live search, sorting, confirmed delete.
3. **03. Timetable & Attendance (`#sec-timetable`)** — `DEFAULT_COLLEGE_TIMETABLE` isolated constant (paste your fixed Mon–Sat routine), custom period add/edit/delete, half-open interval overlap validation, single-click Present / double-click Absent, accessible P/A/Clear micro-buttons, semantic `<table>` ledger with 75% shortage flag.
4. **04. Notes (`#sec-notes`)** — Pastel note cards (amber/coral/lime/lavender/sky), CRUD, live search, snippet preview, updated timestamp, confirmed delete.
5. **05. Resources (`#sec-resources`)** — Curated bookmarks (MDN, GitHub Pages, OWASP, W3C), `http(s)://` URL validation via `new URL()`, safe external anchors, CRUD, search, category filter.
6. **06. Focus & Study Audio (`#sec-focus`)** — Focus timer (15/25/45 min presets, Start/Pause/Reset) + HTML5 `<audio id="study-audio" controls loop>` player with 3 local tracks, track picker, loop toggle, volume slider, play/pause sync, graceful error handling.
7. **Preferences (`#prefs-modal`)** — Display name, Light/Dark theme, attendance target, confirmed Reset that clears only `unidesk.v1.*` keys.

## Run it locally

No build step, no dependencies, no server required:

```bash
# Option A — open directly (offline-friendly, local file)
open index.html        # then click around — fully client-side

# Option B — static server
npx serve .            # or any static file server

# Option C — GitHub Pages style
# push to a public repo with index.html + .nojekyll at the root
```

All asset paths are relative (`./assets/...`), so the app runs from a single extracted folder or from the repository root.

## Deploy on GitHub Pages

1. Push the workspace to a **public** GitHub repository.
2. Root must contain: `index.html`, `.nojekyll`, `assets/`, `docs/`, `README.md`.
3. Repo → **Settings → Pages** → **Deploy from a branch** → branch `main`, folder `/`.
4. Wait up to ~10 minutes for `https://<username>.github.io/<repo>/` to publish.

## Offline LMS ZIP submission

1. Create a single root folder `UniDesk_StudentHub_2026FSWD100/`.
2. Inside it place: `index.html`, `README.md`, `.nojekyll`, `docs/`, `assets/`.
3. Compress the parent folder into `UniDesk_StudentHub_2026FSWD100.zip`.
4. Each team member uploads the **ZIP** and the **Word/PDF report** individually before **27/11/2026**.

## Audio assets

`assets/audio/` contains royalty-free local MP3 loops used by the study player:

- `rain-study.mp3` — Rain on Campus Roof
- `lofi-calm.mp3` — Midnight Lo-Fi Study
- `ambient-pad.mp3` — Warm Ambient Synth

The player **never auto-plays**; it waits for a user click and catches `play()` promise rejections / media errors gracefully.

## Tech boundaries

- HTML5 semantic landmarks, `#sec-*` bookmark fragments, `<table>` with `scope`, labeled forms, `<audio controls loop>`.
- CSS3 only: element/ID/class/universal selectors, box model, `static/relative/absolute/sticky/fixed`, Flexbox (`display:flex; flex-wrap; gap`), media queries down to 375 px. **No CSS Grid, no frameworks.**
- Vanilla ES6+ JS: objects/arrays CRUD, `localStorage` under `unidesk.v1.*` with in-memory fallback, local date keys from `getFullYear/getMonth/getDate`, XSS-safe DOM via `textContent`/`createElement`, `new URL()` protocol validation.

## Docs index

1. `README.md` — this file
2. `docs/PRD.md`
3. `docs/DESIGN.md`
4. `docs/FUNCTIONAL_SPEC.md`
5. `docs/DATA_MODEL.md`
6. `docs/COURSE_ALIGNMENT.md`
7. `docs/ANTIGRAVITY_BUILD_GUIDE.md`
8. `docs/TESTING_AND_DEPLOYMENT.md`
9. `docs/VIVA_PREP.md`
10. `docs/ANTIGRAVITY_MASTER_PROMPT.md`
