# Antigravity Master Prompt — Build UniDesk Student Hub (2026FSWD100)

You are the frontend developer building UniDesk — Student Hub ("One calm place for your college day") for a four-member first-semester B.Tech CSE team (Amritesh Kumar — Team Leader, Naved Ali, Aryan Chahal, Tanishk Singh) for course 2026FSWD100.

READ ALL SPECIFICATIONS FIRST — they are the source of truth:
- README.md
- docs/PRD.md
- docs/DESIGN.md
- docs/FUNCTIONAL_SPEC.md
- docs/DATA_MODEL.md
- docs/COURSE_ALIGNMENT.md
- docs/ANTIGRAVITY_BUILD_GUIDE.md
- docs/TESTING_AND_DEPLOYMENT.md
- docs/VIVA_PREP.md

STRICT TECHNOLOGY & SYLLABUS BOUNDARIES:
- Use ONLY semantic HTML5, CSS3, and vanilla ES6+ JavaScript.
- Persistence: Browser localStorage under keys prefixed strictly with `unidesk.v1.*`, wrapped in try/catch with in-memory fallback.
- Dual hosting: run 100% offline from an extracted LMS ZIP AND on GitHub Pages (create empty `.nojekyll` at root).
- FORBIDDEN: React, Vue, Angular, Svelte, Node.js, npm, Vite, Webpack, TypeScript, Tailwind, Bootstrap, jQuery, remote Google Fonts, external stock photos, paid APIs, CSS Grid.
- CSS3: `box-sizing: border-box` reset, Light/Dark CSS custom properties, element/ID/class/universal selectors, static/relative/absolute/sticky/fixed, Flexbox (`display:flex; flex-wrap; gap`), media queries at desktop ≥1024, tablet 768–1023, mobile 375.

REQUIRED FUNCTIONALITY (six modules + Preferences) and security/date/quality rules are documented module by module in docs/FUNCTIONAL_SPEC.md and docs/DATA_MODEL.md.

ZERO DEAD CONTROLS: every rendered button, chip, link and dialog trigger must work.

STEP-BY-STEP BUILD & VERIFICATION:
1. Create `.nojekyll`, `assets/img/unidesk-logo.svg`, semantic `index.html`, Flexbox/CSS3 `assets/css/styles.css`.
2. Build `DEFAULT_COLLEGE_TIMETABLE`, safe storage wrapper, local date helper, ID generator, seed logic in `assets/js/app.js`.
3. Implement Tasks + Dashboard.
4. Implement Timetable overlap validation, click/dblclick attendance, HTML5 attendance table.
5. Implement Notes + Resources.
6. Implement Focus Timer + HTML5 Study Audio Zone + Preferences modal.
7. Test at desktop, tablet and mobile; confirm zero horizontal scroll and zero uncaught console errors.

ON COMPLETION report strictly: what was built, how to open offline / deploy, which tests were run, missing audio files or remaining limitations, and explain core JS functions in beginner-friendly language for viva defense.
