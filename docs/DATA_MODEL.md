# Data Model — UniDesk Student Hub

## 1. Storage keys (all prefixed `unidesk.v1.`)

| Key | Type | Schema | Seed |
|---|---|---|---|
| `unidesk.v1.prefs` | Object | `{ displayName, theme, attendanceTargetPct }` | `{ displayName: "Amritesh", theme: "light", attendanceTargetPct: 75 }` |
| `unidesk.v1.tasks` | Array | `{ id, title, subject, dueDate, priority, description, completed, createdAt }` | 4 Sem-1 tasks |
| `unidesk.v1.timetable` | Array | `{ id, subject, code, day, startTime, endTime, room, instructor, type, isDefault }` | clone of `DEFAULT_COLLEGE_TIMETABLE` |
| `unidesk.v1.attendance` | Object (nested map) | `{ "YYYY-MM-DD": { "cls_mon_1": "present" \| "absent" } }` | empty / seed |
| `unidesk.v1.notes` | Array | `{ id, title, subject, color, body, updatedAt }` | 3 Sem-1 notes |
| `unidesk.v1.resources` | Array | `{ id, title, url, category, description, createdAt }` | 4 curated links |
| `unidesk.v1.audioPrefs` | Object | `{ trackId, loop, volume }` | `{ trackId: "rain", loop: true, volume: 0.65 }` |

## 2. Storage wrapper

`loadState(key, fallback)` / `saveState(key, value)` use `JSON.parse`, `JSON.stringify` and `try/catch`; fallback to in-memory object on quota/security errors.

## 3. IDs

Stable string IDs via `createId(prefix)` (e.g. `tsk_…`) instead of array indexes.

## 4. Attendance math

- Local date key from `getFullYear()`, `getMonth()+1`, `getDate()` (IST-safe; never `toISOString().slice(0,10)`).
- Subject percentage = present / total marked; shortage when below `attendanceTargetPct`.

## 5. Overlap math

Half-open intervals: reject when `candStart < slotEnd && slotStart < candEnd`; allow back-to-back (`09:00–10:00` + `10:00–11:00`).
