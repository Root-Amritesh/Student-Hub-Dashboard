# Testing & Deployment — UniDesk Student Hub

## 1. Manual test plan (Chrome / Edge / Firefox DevTools)

- Verify all six sidebar tabs, mobile fixed bottom buttons and `#sec-*` links navigate cleanly (zero dead controls, zero uncaught console errors).
- Create / edit / toggle / search / filter / sort / delete tasks; empty submissions show inline errors without reload.
- Add overlapping Tuesday class (inline reject) and back-to-back class (accept).
- Double-click a period → Absent; confirm Present never flashes first; single-click → Present; refresh → persists and updates table.
- Create pastel notes, search bodies; `javascript:alert(1)` resource URL rejected; external links open in new tab with `rel="noopener noreferrer"`.
- Play each track, toggle loop, switch sections mid-play, rename MP3 → friendly missing-file error, no uncaught Promise exceptions.
- Change display name, toggle dark, refresh, Reset Data; DevTools → Application → Local Storage shows only `unidesk.v1.*` keys cleared; 375 px → zero horizontal scroll (`document.documentElement.scrollWidth <= window.innerWidth`).

## 2. LMS ZIP submission

- Root folder `UniDesk_StudentHub_2026FSWD100/` containing `index.html`, `README.md`, `.nojekyll`, `docs/`, `assets/`.
- Open `index.html` directly in Chrome/Edge; verify relative asset paths (`./assets/...`).
- Compress to ZIP; each member uploads ZIP + Word/PDF report individually before 27/11/2026.

## 3. GitHub Pages deployment

- Push public repo; `index.html` + `.nojekyll` at root; Settings → Pages → Deploy from branch (main, / (root)); up to 10 min.

## 4. Audio sizing notes

- Seamless 60–120 s loops preferred; ~64–96 kbps MP3s; bundled loops are ~0.3 MB total.
