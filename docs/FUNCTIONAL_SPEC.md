# Functional Specification and Interaction Flows — UniDesk Student Hub

## 1. Navigation

Six modules live in a single HTML5 workspace, connected by semantic navigation lists and HTML5 bookmark anchor fragments:

`#sec-dashboard`, `#sec-tasks`, `#sec-timetable`, `#sec-notes`, `#sec-resources`, `#sec-focus`.

Switching sections updates a `hashchange` listener and toggles section visibility without reloading the document — allowing study music in `#sec-focus` to keep playing while the student edits notes, tasks or attendance.

## 2. Dashboard flows

- Greeting: time-aware ("Good morning/afternoon/evening") + saved display name + formatted local date.
- KPI tiles recomputed live from tasks / timetable / attendance / audio prefs.
- Completion percentage is `0` safely when there are zero tasks; rendered with `<progress value max="100">`.
- Today's classes sorted by `startTime`; status from date-keyed attendance map.

## 3. Tasks flows

- Submit: `preventDefault`, inline validation, feedback into `<p class="field-error" aria-live="polite">`.
- Filters / search / sort as specified in the PRD.
- Delete: confirmation `<dialog>` before mutation.

## 4. Timetable & attendance flows

- Default routine load / restore.
- Add custom period with end > start and no same-day overlap (half-open interval math).
- Click vs double-click disambiguation with 240 ms timer + `clearTimeout`.

## 5. Notes / Resources / Focus / Preferences flows

See module-level sections of the blueprint. All destructive actions require confirmation dialogs; all user text is rendered via `textContent`/`createElement`.

## 6. Error & fallback flows

- `audio.play()` promise rejection → calm inline setup message.
- `<audio>` error event → friendly missing-file instruction.
- localStorage failure → in-memory fallback + non-blocking toast.
