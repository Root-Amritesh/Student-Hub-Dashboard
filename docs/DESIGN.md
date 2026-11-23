# Design Document — UniDesk Student Hub

## 1. Design language

UniDesk harmonizes six visual references (Bento/Deadline dashboard, Atlas task board, Class Optima timetable, Docket notes, Bookmark Manager resources, Focus zone) into **one quiet, structured workspace** — no competing styles.

- Dashboard: four crisp Bento KPI tiles, personalized welcome header, task + schedule split, royal-blue (#2563EB) Focus Mode hero as deliberate focal point on clean white (#FFFFFF) over cool mist canvas (#F4F6FA).
- Tasks: structured top search-and-filter bar with status pills (Today, Overdue, Done) and subtle priority badges (High, Medium, Low).
- Timetable: Mon–Sat weekday columns with color-accented class blocks (Lecture, Lab, Tutorial) + adjacent attendance summary.
- Notes: rounded pastel cards (amber, coral, lime, lavender, sky) with dark legible ink and compact bottom actions.
- Resources: tag-filter bar + three-column resource card grid.

## 2. Design tokens

See the token block in the project blueprint (`--bg-canvas`, `--bg-surface`, `--text-primary`, `--accent`, state and note palettes) with verified WCAG 2.1 AA contrast in Light and Dark.

## 3. Typography

- UI text: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Monospace: `ui-monospace, SFMono-Regular, Consolas, monospace` for class hours, countdown clocks, percentages.

## 4. Layout

- Sticky header + sticky sidebar nav (desktop), fixed mobile bottom nav (≤767 px), toast container.
- Flexbox-only multi-column layouts; careful `flex: 1 1 calc(...)` basis math to prevent premature wrapping; `@media` breakpoints at ≥1024 px (desktop), 768–1023 px (tablet), ≤767 px (mobile).

## 5. Accessibility

- WCAG 2.1 AA contrast ≥ 4.5:1 for text; pastels verified ≥ 9.5:1 with dark ink.
- Keyboard-accessible P/A/Clear micro-buttons; `aria-live` error slots; semantic tables with `scope="col"`; labeled controls; dialogs via `<dialog>`.
