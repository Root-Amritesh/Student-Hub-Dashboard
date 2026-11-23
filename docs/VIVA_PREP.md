# Viva Preparation — UniDesk Student Hub

## 1. Common faculty questions with first-semester answers

**Q1: How do you prevent a double-click (Absent) from triggering a single-click (Present) first?**
Browsers fire two click events before dblclick. UniDesk waits 240 ms via `setTimeout` before recording Present; dblclick calls `clearTimeout` and records Absent.

**Q2: Why Flexbox instead of CSS Grid?**
Flexbox (`display:flex; flex-wrap; gap`) is taught in Module 2 of 2026FSWD100; Flexbox + `box-sizing:border-box` + media queries covers all responsive needs without untaught CSS modules.

**Q3: Where are all five CSS position values applied?**
static (default card flow), relative (period/note cards), absolute (attendance badge), sticky (sidebar/header), fixed (mobile bottom nav + toast).

**Q4: Why `textContent` and `createElement` rather than `innerHTML`?**
`innerHTML` with user input allows script/HTML execution (XSS). `textContent` renders strictly as text.

**Q5: Why avoid `new Date().toISOString().slice(0,10)`?**
`toISOString()` converts IST to UTC; between midnight and 05:29 IST the UTC date is still yesterday.

**Q6: Why doesn't study music auto-play on load?**
Browser autoplay policies block unmuted playback before user gesture (NotAllowedError); `<audio>` plays only on explicit user action and catches Promise rejections.

**Q7: Why does localStorage behave more predictably on GitHub Pages than `file://`?**
HTTPS origin gives consistent storage up to ~5 MiB; `file://` uses opaque origins with browser-specific quirks — handled by try/catch in-memory fallback.

## 2. Defense points per module

- Dashboard: live KPI computation, sorting.
- Tasks: validation, filters, sorting.
- Timetable: overlap math, click timers, attendance aggregation.
- Notes/Resources/Focus/Audio: safe rendering, media events.

## 3. Report talking points

Keep answers short, use the vocabulary from the docs, and map each answer back to one syllabus topic.
