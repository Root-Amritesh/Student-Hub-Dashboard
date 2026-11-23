"use strict";

/* ==========================================================================
   UniDesk Student Hub — Application State & Logic
   Course: 2026FSWD100 (B.Tech CSE, Bennett University)
   Architecture: zero-dependency · HTML5 + CSS3 + Vanilla ES6+

   Key rules implemented here (defensible in viva):
   1. All persistence lives under keys prefixed "unidesk.v1." via a
      try/catch loadState / saveState wrapper (in-memory fallback).
   2. Local date keys are built from getFullYear()/getMonth()/getDate()
      — never from new Date().toISOString().slice(0, 10) (IST safety).
   3. User text is always rendered with textContent / createElement —
      never innerHTML (XSS safety).
   4. Single-click Present vs double-click Absent uses a 240 ms timer that
      the dblclick handler cancels via clearTimeout.
   5. Schedule overlap uses half-open interval math: candStart < slotEnd && slotStart < candEnd.
   ========================================================================== */

/* ---------- 1. Isolated college routine configuration ----------
   Real weekly routine transcribed from the Bennett University LMS
   (Semester 1, 2026-2027) screenshots dated 16-22 Nov 2026.
   Sat and Sun have no scheduled classes, so they are intentionally empty.
   Keep 24-hour "HH:MM" strings so sorting and overlap math remain exact. */
const DEFAULT_COLLEGE_TIMETABLE = [
  // Monday — 16 Nov 2026
  { id: "cls_mon_web_0820", day: "Mon", startTime: "08:20", endTime: "09:20", subject: "Web Development", code: "2026FSWD100", room: "P-CC-121", instructor: "Himanshu Sharma", type: "Lecture", isDefault: true },
  { id: "cls_mon_calc_0925", day: "Mon", startTime: "09:25", endTime: "10:25", subject: "Calculus", code: "2026MATH102", room: "P-CC-310", instructor: "Shaily", type: "Lecture", isDefault: true },
  { id: "cls_mon_envs_1345", day: "Mon", startTime: "13:45", endTime: "14:45", subject: "Environmental Studies I", code: "2026ENVS151", room: "P-CC-121", instructor: "Vaishali", type: "Lecture", isDefault: true },
  { id: "cls_mon_trep_1450", day: "Mon", startTime: "14:50", endTime: "15:50", subject: "Transdisciplinary Research, Entrepreneurship & Project (TREP)", code: "TREP101", room: "P-CC-315", instructor: "Mukund Pratap Singh (Indu Sharma)", type: "Tutorial", isDefault: true },
  { id: "cls_mon_eece_prac1_1555", day: "Mon", startTime: "15:55", endTime: "16:55", subject: "Introduction to Electrical and Electronics Engineering", code: "2026EECE110", room: "214-A-LA", instructor: "Roshni Mishra", type: "Practical", isDefault: true },
  { id: "cls_mon_eece_prac2_1700", day: "Mon", startTime: "17:00", endTime: "18:00", subject: "Introduction to Electrical and Electronics Engineering", code: "2026EECE110", room: "214-A-LA", instructor: "Roshni Mishra", type: "Practical", isDefault: true },
  // Tuesday — 17 Nov 2026
  { id: "cls_tue_sports_0820", day: "Tue", startTime: "08:20", endTime: "09:20", subject: "Sports-I: Basic Sports Training Fundamentals & Skills", code: "SPLA101", room: "SCSET", instructor: "Dummy Faculty", type: "Lecture", isDefault: true },
  { id: "cls_tue_eece_tut_0925", day: "Tue", startTime: "09:25", endTime: "10:25", subject: "Introduction to Electrical and Electronics Engineering", code: "2026EECE110", room: "128-N-CA", instructor: "Mohan Kumar Paswan", type: "Tutorial", isDefault: true },
  { id: "cls_tue_dd_lect_1030", day: "Tue", startTime: "10:30", endTime: "11:30", subject: "Digital Design", code: "2026CSAE101", room: "011-N-CC", instructor: "Ashok Rai", type: "Lecture", isDefault: true },
  { id: "cls_tue_dd_prac1_1240", day: "Tue", startTime: "12:40", endTime: "13:40", subject: "Digital Design", code: "2026CSAE101", room: "105-A-LA", instructor: "Mahadev Ajagalla", type: "Practical", isDefault: true },
  { id: "cls_tue_dd_prac2_1345", day: "Tue", startTime: "13:45", endTime: "14:45", subject: "Digital Design", code: "2026CSAE101", room: "105-A-LA", instructor: "Mahadev Ajagalla", type: "Practical", isDefault: true },
  { id: "cls_tue_eece_lect_1555", day: "Tue", startTime: "15:55", endTime: "16:55", subject: "Introduction to Electrical and Electronics Engineering", code: "2026EECE110", room: "P-CB-304", instructor: "Mahesh Kumawat", type: "Lecture", isDefault: true },
  // Wednesday — 18 Nov 2026
  { id: "cls_wed_calc_tut_0820", day: "Wed", startTime: "08:20", endTime: "09:20", subject: "Calculus", code: "2026MATH102", room: "127-N-CA", instructor: "K. M. Kavya", type: "Tutorial", isDefault: true },
  { id: "cls_wed_ctp_lect_1240", day: "Wed", startTime: "12:40", endTime: "13:40", subject: "Computational Thinking and Programming", code: "2026CSAE100", room: "P-CC-315", instructor: "Gopal Rawat", type: "Lecture", isDefault: true },
  { id: "cls_wed_calc_lect_1345", day: "Wed", startTime: "13:45", endTime: "14:45", subject: "Calculus", code: "2026MATH102", room: "011-N-CC", instructor: "Shaily", type: "Lecture", isDefault: true },
  { id: "cls_wed_eece_lect_1555", day: "Wed", startTime: "15:55", endTime: "16:55", subject: "Introduction to Electrical and Electronics Engineering", code: "2026EECE110", room: "P-CC-310", instructor: "Mahesh Kumawat", type: "Lecture", isDefault: true },
  // Thursday — 19 Nov 2026
  { id: "cls_thu_ctp_prac1_1240", day: "Thu", startTime: "12:40", endTime: "13:40", subject: "Computational Thinking and Programming", code: "2026CSAE100", room: "B-LA-210", instructor: "Amit Kumar", type: "Practical", isDefault: true },
  { id: "cls_thu_ctp_prac2_1345", day: "Thu", startTime: "13:45", endTime: "14:45", subject: "Computational Thinking and Programming", code: "2026CSAE100", room: "B-LA-210", instructor: "Amit Kumar", type: "Practical", isDefault: true },
  { id: "cls_thu_calc_lect_1450", day: "Thu", startTime: "14:50", endTime: "15:50", subject: "Calculus", code: "2026MATH102", room: "011-N-CC", instructor: "Shaily", type: "Lecture", isDefault: true },
  // Friday — 20 Nov 2026
  { id: "cls_fri_dd_lect_0820", day: "Fri", startTime: "08:20", endTime: "09:20", subject: "Digital Design", code: "2026CSAE101", room: "P-CC-018", instructor: "Ashok Rai", type: "Lecture", isDefault: true },
  { id: "cls_fri_ctp_lect_0925", day: "Fri", startTime: "09:25", endTime: "10:25", subject: "Computational Thinking and Programming", code: "2026CSAE100", room: "P-CC-315", instructor: "Gopal Rawat", type: "Lecture", isDefault: true },
];

/* ---------- 2. Storage helpers : unidesk.v1.* keys + in-memory fallback ---------- */
const STORAGE_PREFIX = "unidesk.v1.";
const memoryStore = {};
let storageAvailable = true;
let storageWarningShown = false;

function loadState(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) { return fallback; }
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined || typeof parsed !== "object") { return fallback; }
    return parsed;
  } catch (err) {
    memoryStore[key] = fallback;
    storageAvailable = false;
    return fallback;
  }
}

function saveState(key, value) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    storageAvailable = true;
    return true;
  } catch (err) {
    memoryStore[key] = value;
    storageAvailable = false;
    if (!storageWarningShown) {
      storageWarningShown = true;
      showToast("Browser storage is unavailable — UniDesk is running on in-memory data for this session.");
    }
    return false;
  }
}

function clearUniDeskKeys() {
  const keys = [];
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) { keys.push(k); }
    }
    keys.forEach((k) => { window.localStorage.removeItem(k); });
  } catch (err) { /* storage blocked — nothing to clear */ }
  return keys.length;
}

/* ---------- 3. Local-date helpers (IST-safe) ---------- */
function pad2(n) { return String(n).padStart(2, "0"); }

function getLocalDateKey(date) {
  const d = date || new Date();
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}

function getTodayKey() { return getLocalDateKey(); }

function addDaysToKey(key, days) {
  const d = new Date(key + "T00:00:00");
  d.setDate(d.getDate() + days);
  return getLocalDateKey(d);
}

const WEEKDAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayNameFromKey(key) {
  return WEEKDAY_KEYS[new Date(key + "T00:00:00").getDay()] || "Mon";
}

function formatLongDate(key) {
  return new Date(key + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/* ---------- 4. Small utilities ---------- */
function createId(prefix) {
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function toMinutes(hhmm) {
  const parts = String(hhmm || "00:00").split(":");
  const hours = Number(parts[0]) || 0;
  const mins = Number(parts[1]) || 0;
  return hours * 60 + mins;
}

function hasScheduleOverlap(candidate, entries, editingId) {
  const candStart = toMinutes(candidate.startTime);
  const candEnd = toMinutes(candidate.endTime);
  const list = Array.isArray(entries) ? entries : [];
  return list.some((slot) => {
    if (slot.id === editingId || slot.day !== candidate.day) { return false; }
    const slotStart = toMinutes(slot.startTime);
    const slotEnd = toMinutes(slot.endTime);
    return candStart < slotEnd && slotStart < candEnd;
  });
}

/* ---------- 5. Seed data ---------- */
function seedTasks() {
  const today = getTodayKey();
  return [
    { id: "tsk_101", title: "Complete UniDesk Student Hub build", subject: "Web Development", dueDate: addDaysToKey(today, 2), priority: "high", description: "Finish index.html, assets/css/styles.css, assets/js/app.js and the docs/ specification pack for 2026FSWD100.", completed: false, createdAt: today },
    { id: "tsk_102", title: "Web Development Lab sheet submission", subject: "Web Development", dueDate: addDaysToKey(today, 1), priority: "high", description: "Compile and submit the lab sheet before the LMS deadline.", completed: false, createdAt: today },
    { id: "tsk_103", title: "Revision: HTML5 semantic elements", subject: "Web Development", dueDate: addDaysToKey(today, 4), priority: "medium", description: "Revise landmarks, sections, articles and bookmark fragments.", completed: false, createdAt: today },
    { id: "tsk_104", title: "Read MDN guide: CSS Flexbox", subject: "Web Development", dueDate: addDaysToKey(today, 6), priority: "low", description: "Skim the Flexbox basics before the next class.", completed: false, createdAt: today },
  ];
}

function seedTimetable() {
  return DEFAULT_COLLEGE_TIMETABLE.map((slot) => Object.assign({}, slot));
}

/* Existing browsers may still hold the old sample routine from before the
   real college timetable was entered. Detect it by its sample-only subjects
   and swap it once; any user-added (non-default) periods are kept. */
const LEGACY_SAMPLE_SUBJECTS = [
  "Web Development Lab", "Data Structures", "Database Management",
  "Computer Networks", "Software Engineering", "Operating Systems",
];
const LEGACY_SAMPLE_IDS = ["cls_mon_1", "cls_mon_2", "cls_tue_1", "cls_tue_2", "cls_wed_1", "cls_wed_2", "cls_thu_1", "cls_thu_2", "cls_fri_1", "cls_fri_2"];

function isLegacySampleSlot(slot) {
  return Boolean(slot && slot.isDefault && (
    LEGACY_SAMPLE_IDS.indexOf(slot.id) !== -1 ||
    LEGACY_SAMPLE_SUBJECTS.indexOf(slot.subject) !== -1
  ));
}

function loadTimetable() {
  const stored = loadState("timetable", null);
  if (!Array.isArray(stored) || stored.length === 0) { return seedTimetable(); }
  if (!stored.some(isLegacySampleSlot)) { return stored; }
  const customs = stored.filter((slot) => slot && !slot.isDefault);
  return seedTimetable().concat(customs);
}

function seedNotes() {
  const today = getTodayKey();
  return [
    {
      id: "note_101",
      title: "HTML5 Semantic Landmarks",
      subject: "Web Development",
      color: "lavender",
      body: "Use header, nav, main, section, article and footer landmarks so assistive tech can jump between regions. Link modules with bookmark fragments like #sec-dashboard.",
      updatedAt: today,
    },
    {
      id: "note_102",
      title: "CSS Box Model & Flexbox",
      subject: "Web Development",
      color: "sky",
      body: "Content + padding + border + margin. Layout columns with display:flex, flex-wrap and gap instead of CSS Grid.",
      updatedAt: today,
    },
    {
      id: "note_103",
      title: "JS DOM Safety",
      subject: "Web Development",
      color: "amber",
      body: "Build nodes with document.createElement and set textContent — never inject user input through innerHTML.",
      updatedAt: today,
    },
  ];
}

function seedResources() {
  return [
    { id: "res_101", title: "MDN Web Docs", url: "https://developer.mozilla.org", category: "Documentation", description: "Reference for HTML5, CSS3, JavaScript and web platform APIs.", createdAt: getTodayKey() },
    { id: "res_102", title: "GitHub Pages Quickstart", url: "https://pages.github.com", category: "Deployment", description: "Static site hosting used for the GitHub Pages deployment track.", createdAt: getTodayKey() },
    { id: "res_103", title: "OWASP Top Ten", url: "https://owasp.org/www-project-top-ten/", category: "Security", description: "Security awareness reference — includes the XSS prevention topic.", createdAt: getTodayKey() },
    { id: "res_104", title: "W3C Web Accessibility", url: "https://www.w3.org/WAI/", category: "Accessibility", description: "WCAG guidelines for semantic markup, contrast and keyboard access.", createdAt: getTodayKey() },
  ];
}

/* ---------- 6. Application state ---------- */
const state = {
  prefs: loadState("prefs", { displayName: "Amritesh", theme: "light", attendanceTargetPct: 75 }),
  tasks: loadState("tasks", seedTasks()),
  timetable: loadTimetable(),
  attendance: loadState("attendance", {}),
  notes: loadState("notes", seedNotes()),
  resources: loadState("resources", seedResources()),
  audioPrefs: loadState("audioPrefs", { trackId: "rain-study", loop: true, volume: 0.65 }),
};

function persistAll() {
  saveState("prefs", state.prefs);
  saveState("tasks", state.tasks);
  saveState("timetable", state.timetable);
  saveState("attendance", state.attendance);
  saveState("notes", state.notes);
  saveState("resources", state.resources);
  saveState("audioPrefs", state.audioPrefs);
}

function persistState(key) {
  saveState(key, state[key]);
}

/* ---------- 7. Toast notifications ---------- */
function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  window.setTimeout(() => { toast.remove(); }, 3800);
}

/* ---------- 8. XSS-safe DOM element helpers ---------- */
function makeEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) { node.className = className; }
  if (text !== undefined && text !== null) { node.textContent = String(text); }
  return node;
}

/* ---------- 9. Navigation ---------- */
const NAV_SECTIONS = ["dashboard", "tasks", "timetable", "notes", "resources", "focus"];

function updateNavActive(sectionId) {
  const activeName = String(sectionId || "").replace(/^sec-/, "");
  document.querySelectorAll("a[data-nav]").forEach((link) => {
    const isActive = link.getAttribute("data-nav") === activeName;
    link.classList.toggle("active", isActive);
    if (isActive) { link.setAttribute("aria-current", "page"); } else { link.removeAttribute("aria-current"); }
  });
}

function showSection(id) {
  const target = document.getElementById(id);
  if (!target) { return; }
  document.querySelectorAll("section.module").forEach((section) => { section.classList.remove("module-active"); });
  target.classList.add("module-active");
  updateNavActive(id);
  if (window.location.hash !== "#" + id) { window.location.hash = id; }
  target.scrollIntoView({ behavior: "auto", block: "start" });
}

function handleNavClick(event) {
  const link = event.target.closest("a[data-nav]");
  if (!link) { return; }
  event.preventDefault();
  showSection(link.getAttribute("href").replace("#", ""));
}

function handleHashChange() {
  const raw = window.location.hash.replace("#", "");
  const hash = raw.startsWith("sec-") ? raw.slice(4) : raw;
  if (NAV_SECTIONS.includes(hash)) { showSection("sec-" + hash); }
}

/* ---------- 10. Theme ---------- */
function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  state.prefs.theme = next;
  persistState("prefs");
  const label = document.getElementById("theme-toggle-label");
  if (label) { label.textContent = next === "light" ? "Switch to Dark" : "Switch to Light"; }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) { meta.setAttribute("content", next === "dark" ? "#0F172A" : "#2563EB"); }
  const select = document.getElementById("prefs-theme");
  if (select) { select.value = next; }
}

function initTheme() {
  applyTheme(state.prefs.theme);
}

/* ---------- 11. Dashboard ---------- */
function greeting() {
  const hour = new Date().getHours();
  const name = (state.prefs.displayName || "Friend").trim() || "Friend";
  if (hour < 12) { return "Good morning"; }
  if (hour < 17) { return "Good afternoon"; }
  return "Good evening";
}

function renderKpiCards() {
  const kpiRow = document.getElementById("kpi-row");
  kpiRow.textContent = "";
  const tasks = Array.isArray(state.tasks) ? state.tasks : [];
  const openTasks = tasks.filter((t) => !t.completed);
  const dueToday = tasks.filter((t) => !t.completed && t.dueDate === getTodayKey());
  const completedTasks = tasks.filter((t) => t.completed);
  const completionPct = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const attendance = state.attendance[getTodayKey()] || {};
  const todayDayName = dayNameFromKey(getTodayKey());
  const todaysClasses = (Array.isArray(state.timetable) ? state.timetable : []).filter((t) => t.day === todayDayName);
  const presentCount = todaysClasses.filter((c) => attendance[c.id] === "present").length;
  const absentCount = todaysClasses.filter((c) => attendance[c.id] === "absent").length;
  const markedCount = presentCount + absentCount;
  const attendanceHint = !todaysClasses.length
    ? "No classes scheduled today"
    : markedCount
      ? markedCount + " of " + todaysClasses.length + " classes marked today"
      : "No attendance marked yet today";

  const kpiDefs = [
    { title: "Open Tasks", value: String(openTasks.length), hint: completedTasks.length + " of " + tasks.length + " tasks completed" },
    { title: "Tasks Due Today", value: String(dueToday.length), hint: dueToday.length ? "One or more deadlines today" : "Nothing due today — nice work" },
    { title: "Completion Rate", value: completionPct + "%", hint: "Use the progress bar", progress: completionPct },
    { title: "Today's Attendance", value: todaysClasses.length ? presentCount + " / " + todaysClasses.length : "—", hint: attendanceHint },
  ];

  kpiDefs.forEach((kpi) => {
    const card = makeEl("div", "kpi-card");
    const heading = makeEl("h3", null, kpi.title);
    const value = makeEl("div", "kpi-value");
    value.textContent = kpi.value;
    const hint = makeEl("p", "kpi-hint", kpi.hint);
    card.appendChild(heading);
    card.appendChild(value);
    if (typeof kpi.progress === "number") {
      const progress = document.createElement("progress");
      progress.max = 100;
      progress.value = Math.min(100, Math.max(0, kpi.progress));
      card.appendChild(progress);
    }
    card.appendChild(hint);
    kpiRow.appendChild(card);
  });
}

function renderTodayClasses() {
  const listEl = document.getElementById("today-classes-list");
  listEl.textContent = "";
  const todayKey = getTodayKey();
  const todayDayName = dayNameFromKey(todayKey);
  const classes = (Array.isArray(state.timetable) ? state.timetable : []).filter((t) => t.day === todayDayName).sort(byStartTime);
  document.getElementById("today-classes-date").textContent = classes.length
    ? formatLongDate(todayKey) + " · " + classes.length + " class(es) scheduled"
    : "No classes scheduled for today.";

  if (!classes.length) {
    listEl.appendChild(makeEl("p", "empty-state", "No classes scheduled for today."));
    return;
  }

  classes.forEach((cls) => {
    const card = periodCard(cls, todayKey);
    card.classList.add("dashboard-period-card");
    listEl.appendChild(card);
  });
}

function byStartTime(a, b) {
  return String(a.startTime).localeCompare(String(b.startTime)) || String(a.endTime).localeCompare(String(b.endTime));
}

function renderTodayTasks() {
  const listEl = document.getElementById("today-tasks-list");
  listEl.textContent = "";
  const todayKey = getTodayKey();
  const open = (Array.isArray(state.tasks) ? state.tasks : []).filter((t) => !t.completed);
  const upcoming = open
    .filter((t) => t.dueDate >= todayKey)
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
  const overdue = open
    .filter((t) => t.dueDate < todayKey)
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
  const combined = overdue.concat(upcoming).slice(0, 5);

  if (!combined.length) {
    const empty = makeEl("p", "empty-state", "No open tasks. Add one from the Tasks module!");
    listEl.appendChild(empty);
    return;
  }
  combined.forEach((task) => {
    const item = makeEl("article", "task-card");
    const title = makeEl("h4", "task-title", task.title);
    const meta = makeEl("div", "task-meta");
    const dueText = makeEl("span", null, "Due " + task.dueDate + (task.dueDate === todayKey ? " · Today" : task.dueDate < todayKey ? " · Overdue" : ""));
    const subjectText = makeEl("span", null, task.subject);
    meta.appendChild(dueText);
    meta.appendChild(subjectText);
    item.appendChild(title);
    item.appendChild(meta);
    listEl.appendChild(item);
  });
}

function renderDashboard() {
  renderKpiCards();
  renderTodayClasses();
  renderTodayTasks();
  const dashTitle = document.getElementById("dashboard-title");
  if (dashTitle) { dashTitle.textContent = greeting() + ", " + ((state.prefs.displayName || "Friend").trim() || "Friend"); }
  updateFocusHeroStatus();
}

/* ---------- 12. Tasks module ---------- */
let taskFilter = "all";
let taskSearch = "";
let taskSort = "due";
let editingTaskId = null;

function taskMatchesFilter(task) {
  switch (taskFilter) {
    case "today": return !task.completed && task.dueDate === getTodayKey();
    case "upcoming": return !task.completed && task.dueDate > getTodayKey();
    case "completed": return !!task.completed;
    case "overdue": return !task.completed && task.dueDate < getTodayKey();
    default: return true;
  }
}

function compareTasks(a, b) {
  if (taskSort === "priority") {
    const pa = a.priority === "high" ? 0 : a.priority === "medium" ? 1 : 2;
    const pb = b.priority === "high" ? 0 : b.priority === "medium" ? 1 : 2;
    if (pa !== pb) { return pa - pb; }
  }
  if (taskSort === "newest") {
    const ta = String(a.createdAt || "");
    const tb = String(b.createdAt || "");
    if (ta !== tb) { return tb.localeCompare(ta); }
    return String(a.id).localeCompare(String(b.id));
  }
  if (String(a.dueDate) !== String(b.dueDate)) { return String(a.dueDate) < String(b.dueDate) ? -1 : 1; }
  if (String(a.createdAt) !== String(b.createdAt)) { return String(a.createdAt) < String(b.createdAt) ? -1 : 1; }
  return String(a.id).localeCompare(String(b.id));
}

function getFilteredTasks() {
  const source = Array.isArray(state.tasks) ? state.tasks : [];
  let list = source.filter(taskMatchesFilter);
  const q = taskSearch.trim().toLowerCase();
  if (q) {
    list = list.filter((t) => (String(t.title) + " " + String(t.subject) + " " + String(t.description || "")).toLowerCase().indexOf(q) > -1);
  }
  return list.slice().sort(compareTasks);
}

function setTaskError(id, message) {
  const el = document.getElementById(id);
  if (!el) { return; }
  el.textContent = message || "";
}

function resetTaskForm() {
  editingTaskId = null;
  const form = document.getElementById("task-form");
  if (!form) { return; }
  form.reset();
  document.getElementById("task-title").setCustomValidity("");
  document.getElementById("task-subject").setCustomValidity("");
  document.getElementById("task-due").setCustomValidity("");
  setTaskError("task-error-title", "");
  setTaskError("task-error-subject", "");
  setTaskError("task-error-due", "");
  const submitBtn = document.getElementById("task-submit");
  submitBtn.textContent = "Add Task";
  const cancelBtn = document.getElementById("task-cancel-edit");
  if (cancelBtn) { cancelBtn.hidden = true; }
}

function setTaskEditing(id) {
  const task = (Array.isArray(state.tasks) ? state.tasks : []).find((t) => t.id === id);
  if (!task) { return; }
  editingTaskId = id;
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-subject").value = task.subject;
  document.getElementById("task-due").value = task.dueDate;
  document.getElementById("task-priority").value = task.priority || "medium";
  document.getElementById("task-description").value = task.description || "";
  document.getElementById("task-submit").textContent = "Save Changes";
  const cancelBtn = document.getElementById("task-cancel-edit");
  if (cancelBtn) { cancelBtn.hidden = false; }
  document.getElementById("task-form").scrollIntoView({ behavior: "smooth", block: "center" });
}

function handleTaskSubmit(event) {
  event.preventDefault();
  const title = document.getElementById("task-title").value.trim();
  const subject = document.getElementById("task-subject").value.trim();
  const dueDate = document.getElementById("task-due").value;
  const priority = document.getElementById("task-priority").value;
  const description = document.getElementById("task-description").value.trim();

  let ok = true;
  const titleMsg = title.length < 2 || title.length > 100 ? "Title must be between 2 and 100 characters." : "";
  setTaskError("task-error-title", titleMsg);
  document.getElementById("task-title").setCustomValidity(titleMsg);
  if (titleMsg) { ok = false; }

  const subjectMsg = subject.length < 1 ? "Subject is required." : "";
  setTaskError("task-error-subject", subjectMsg);
  document.getElementById("task-subject").setCustomValidity(subjectMsg);
  if (subjectMsg) { ok = false; }

  const dueMsg = !dueDate ? "Due date is required." : !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ? "Due date must be a valid YYYY-MM-DD date." : "";
  setTaskError("task-error-due", dueMsg);
  document.getElementById("task-due").setCustomValidity(dueMsg);
  if (dueMsg) { ok = false; }

  if (!ok) { return; }

  if (editingTaskId) {
    const task = (Array.isArray(state.tasks) ? state.tasks : []).find((t) => t.id === editingTaskId);
    if (task) {
      task.title = title;
      task.subject = subject;
      task.dueDate = dueDate;
      task.priority = priority;
      task.description = description;
      task.updatedAt = getTodayKey();
    }
  } else {
    state.tasks.push({
      id: createId("tsk"),
      title: title,
      subject: subject,
      dueDate: dueDate,
      priority: priority,
      description: description,
      completed: false,
      createdAt: getTodayKey(),
    });
  }
  persistState("tasks");
  resetTaskForm();
  renderTasks();
  renderDashboard();
}

function toggleTaskComplete(id) {
  const task = (Array.isArray(state.tasks) ? state.tasks : []).find((t) => t.id === id);
  if (!task) { return; }
  task.completed = !task.completed;
  persistState("tasks");
  renderTasks();
  renderDashboard();
}

function openTaskDialog(id) {
  const task = (Array.isArray(state.tasks) ? state.tasks : []).find((t) => t.id === id);
  if (!task) { return; }
  document.getElementById("task-dialog-message").textContent = "Delete task \"" + task.title + "\"? This cannot be undone.";
  document.getElementById("task-confirm").dataset.id = id;
  document.getElementById("dialog-task").showModal();
}

function confirmDeleteTask() {
  const id = document.getElementById("task-confirm").dataset.id;
  state.tasks = (Array.isArray(state.tasks) ? state.tasks : []).filter((t) => t.id !== id);
  persistState("tasks");
  document.getElementById("dialog-task").close();
  renderTasks();
  renderDashboard();
}

function renderTasks() {
  const listEl = document.getElementById("task-list");
  listEl.textContent = "";
  const tasks = getFilteredTasks();
  if (!tasks.length) {
    const hasQuery = taskSearch.trim().length > 0 || taskFilter !== "all";
    listEl.appendChild(makeEl("p", "empty-state", hasQuery ? "No tasks match the current search or filter." : "No tasks yet. Add your first assignment above."));
  }
  tasks.forEach((task) => { listEl.appendChild(taskCard(task)); });
  const countEl = document.getElementById("task-count");
  if (countEl) { countEl.textContent = tasks.length + " task(s) shown."; }
}

function taskCard(task) {
  const article = makeEl("article", "task-card" + (task.completed ? " task-completed" : ""));
  const top = makeEl("div", "task-top");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.checked = !!task.completed;
  checkbox.setAttribute("aria-label", "Mark task \"" + task.title + "\" as " + (task.completed ? "open" : "completed"));
  checkbox.addEventListener("change", () => { toggleTaskComplete(task.id); });
  const title = makeEl("h4", "task-title", task.title);
  top.appendChild(checkbox);
  top.appendChild(title);
  article.appendChild(top);

  const meta = makeEl("div", "task-meta");
  const subjectBadge = makeEl("span", "badge", task.subject);
  const dueBadge = makeEl("span", "badge", "Due " + task.dueDate + (task.dueDate === getTodayKey() ? " · Today" : task.dueDate < getTodayKey() ? " · Overdue" : ""));
  const prioBadge = makeEl("span", "badge prio-" + (task.priority || "low"), (task.priority || "low") + " priority");
  meta.appendChild(subjectBadge);
  meta.appendChild(dueBadge);
  meta.appendChild(prioBadge);
  article.appendChild(meta);

  if (task.description) {
    const desc = makeEl("p", "task-description", task.description);
    article.appendChild(desc);
  }

  const actions = makeEl("div", "task-actions");
  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn-ghost btn-sm";
  editBtn.textContent = "Edit";
  editBtn.dataset.action = "edit";
  editBtn.dataset.id = task.id;
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-danger btn-sm";
  deleteBtn.textContent = "Delete";
  deleteBtn.dataset.action = "delete";
  deleteBtn.dataset.id = task.id;
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  article.appendChild(actions);
  return article;
}

/* ---------- 13. Timetable & attendance ---------- */
let attendanceDateKey = getTodayKey();

function markAttendanceStatus(dateKey, classId, status) {
  const key = dateKey || attendanceDateKey;
  if (!state.attendance[key]) { state.attendance[key] = {}; }
  state.attendance[key][classId] = status;
  persistState("attendance");
  renderTimetable();
  renderAttendanceTable();
  renderDashboard();
}

const clickTimers = {};

function onPeriodSingleClick(classId) {
  clearTimeout(clickTimers[classId]);
  clickTimers[classId] = setTimeout(() => {
    markAttendanceStatus(attendanceDateKey, classId, "present");
    delete clickTimers[classId];
  }, 240);
}

function onPeriodDoubleClick(classId) {
  clearTimeout(clickTimers[classId]);
  delete clickTimers[classId];
  markAttendanceStatus(attendanceDateKey, classId, "absent");
}

function markPresent(classId) {
  markAttendanceStatus(attendanceDateKey, classId, "present");
}

function markAbsent(classId) {
  markAttendanceStatus(attendanceDateKey, classId, "absent");
}

function clearAttendance(classId) {
  const key = attendanceDateKey;
  if (!state.attendance[key]) { return; }
  delete state.attendance[key][classId];
  persistState("attendance");
  renderTimetable();
  renderAttendanceTable();
  renderDashboard();
}

function periodCard(cls, dateKey) {
  const card = makeEl("article", "period-card");
  if (cls.isDefault) { card.classList.add("is-default"); }
  const status = ((state.attendance[dateKey] || {})[cls.id]) || "idle";
  card.dataset.classId = cls.id;
  card.dataset.day = cls.day;
  if (status === "present") { card.classList.add("is-present"); }
  if (status === "absent") { card.classList.add("is-absent"); }
  if (status === "idle") { card.classList.add("is-idle"); }

  const top = makeEl("div", "task-top");
  const dot = makeEl("span", "status-dot status-" + status);
  dot.textContent = status === "present" ? "P" : status === "absent" ? "A" : "—";
  const title = makeEl("h4", "task-title", cls.subject + " · " + cls.type);
  top.appendChild(dot);
  top.appendChild(title);
  card.appendChild(top);

  const meta = makeEl("div", "task-meta");
  const timeText = makeEl("span", null, cls.startTime + " – " + cls.endTime);
  const roomText = makeEl("span", null, "Room " + (cls.room || "—") + " · " + (cls.instructor || ""));
  meta.appendChild(timeText);
  meta.appendChild(roomText);
  card.appendChild(meta);

  const badge = makeEl("span", "attendance-badge");
  badge.setAttribute("data-status", status);
  badge.textContent = status === "idle" ? "Idle" : status === "present" ? "Present" : "Absent";
  card.appendChild(badge);

  const actions = makeEl("div", "period-actions");
  ["present", "absent", "clear"].forEach((action) => {
    const btn = makeEl("button", null, action === "present" ? "P" : action === "absent" ? "A" : "Clear");
    btn.type = "button";
    btn.dataset.action = action;
    btn.dataset.id = cls.id;
    const label = action === "present" ? "Mark present" : action === "absent" ? "Mark absent" : "Clear attendance";
    btn.setAttribute("aria-label", label + ": " + cls.subject + " at " + cls.startTime);
    btn.setAttribute("title", label);
    actions.appendChild(btn);
  });
  card.appendChild(actions);

  card.addEventListener("click", (event) => {
    if (event.target.closest("[data-action]")) { return; }
    onPeriodSingleClick(cls.id);
  });
  card.addEventListener("dblclick", (event) => {
    if (event.target.closest("[data-action]")) { return; }
    onPeriodDoubleClick(cls.id);
  });
  card.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      if (action === "present") { markPresent(id); }
      if (action === "absent") { markAbsent(id); }
      if (action === "clear") { clearAttendance(id); }
    });
  });
  return card;
}

function renderTimetable() {
  const grid = document.getElementById("timetable-grid");
  grid.textContent = "";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach((day) => {
    const classes = (Array.isArray(state.timetable) ? state.timetable : []).filter((t) => t.day === day).sort(byStartTime);
    const column = makeEl("div", "period-column");
    column.setAttribute("data-day", day);
    if (day === dayNameFromKey(getTodayKey())) { column.classList.add("is-today"); }
    const heading = makeEl("h4", null, day);
    const list = makeEl("div", "period-list");
    if (!classes.length) { list.appendChild(makeEl("p", "empty-state", "No classes")); }
    classes.forEach((cls) => { list.appendChild(periodCard(cls, attendanceDateKey)); });
    column.appendChild(heading);
    column.appendChild(list);
    grid.appendChild(column);
  });
}

function renderAttendanceTable() {
  const tbody = document.getElementById("attendance-tbody");
  tbody.textContent = "";
  const targetPct = Number(state.prefs.attendanceTargetPct) || 75;
  const subtitle = document.getElementById("attendance-subtitle");
  if (subtitle) { subtitle.textContent = "All marked dates · minimum " + targetPct + "%"; }

  const classes = Array.isArray(state.timetable) ? state.timetable : [];
  if (!classes.length) {
    const row = makeEl("tr", null);
    const cell = makeEl("td", null, "No classes in your timetable yet.");
    cell.colSpan = 6;
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  const classesById = {};
  classes.forEach((cls) => { classesById[cls.id] = cls; });

  const subjects = {};
  function subjectRow(name) {
    if (!subjects[name]) { subjects[name] = { subject: name, present: 0, absent: 0, total: 0 }; }
    return subjects[name];
  }
  classes.forEach((cls) => { subjectRow(cls.subject || cls.code || "Unknown"); });

  Object.keys(state.attendance).forEach((dateKey) => {
    const dayMap = state.attendance[dateKey] || {};
    Object.keys(dayMap).forEach((classId) => {
      const status = dayMap[classId];
      const cls = classesById[classId];
      if (!cls || (status !== "present" && status !== "absent")) { return; }
      const rowData = subjectRow(cls.subject || cls.code || "Unknown");
      if (status === "present") { rowData.present += 1; } else { rowData.absent += 1; }
      rowData.total += 1;
    });
  });

  Object.keys(subjects).sort((a, b) => a.localeCompare(b)).forEach((subjectKey) => {
    const rowData = subjects[subjectKey];
    const total = rowData.total;
    const presentPct = total ? Math.round((rowData.present / total) * 1000) / 10 : null;
    const row = makeEl("tr", null);
    const subjectCell = makeEl("td", null, rowData.subject);
    const presentCell = makeEl("td", "num", String(rowData.present));
    const absentCell = makeEl("td", "num", String(rowData.absent));
    const totalCell = makeEl("td", "num", String(total));
    const pctCell = makeEl("td", "num", presentPct === null ? "—" : presentPct + "%");
    const statusCell = makeEl("td", null, presentPct === null ? "Not marked" : presentPct < targetPct ? "Shortage" : "Safe");
    if (presentPct === null) {
      statusCell.classList.add("no-data");
    } else if (presentPct < targetPct) {
      statusCell.classList.add("shortage");
    } else {
      statusCell.classList.add("safe");
    }
    row.appendChild(subjectCell);
    row.appendChild(presentCell);
    row.appendChild(absentCell);
    row.appendChild(totalCell);
    row.appendChild(pctCell);
    row.appendChild(statusCell);
    tbody.appendChild(row);
  });
}

function handleCustomPeriodSubmit(event) {
  event.preventDefault();
  const subject = document.getElementById("cp-subject").value.trim();
  const code = document.getElementById("cp-code").value.trim();
  const day = document.getElementById("cp-day").value;
  const startTime = document.getElementById("cp-start").value;
  const endTime = document.getElementById("cp-end").value;
  const room = document.getElementById("cp-room").value.trim();
  const instructor = document.getElementById("cp-instructor").value.trim();
  const type = document.getElementById("cp-type").value;

  const cpErrorEl = document.getElementById("cp-error");
  const errors = [];
  if (subject.length < 1) { errors.push("Subject is required."); }
  if (!startTime) { errors.push("Start time is required."); }
  if (!endTime) { errors.push("End time is required."); }
  if (startTime && endTime && toMinutes(endTime) <= toMinutes(startTime)) { errors.push("End time must be after start time."); }
  if (errors.length) {
    if (cpErrorEl) { cpErrorEl.textContent = errors.join(" "); }
    return;
  }

  const candidate = {
    id: editingCustomPeriodId || createId("cls"),
    subject: subject,
    code: code,
    day: day,
    startTime: startTime,
    endTime: endTime,
    room: room,
    instructor: instructor,
    type: type,
    isDefault: false
  };
  if (hasScheduleOverlap(candidate, state.timetable, editingCustomPeriodId)) {
    if (cpErrorEl) { cpErrorEl.textContent = "This period overlaps another class on the same day. Allow a gap or use back-to-back times."; }
    return;
  }
  if (cpErrorEl) { cpErrorEl.textContent = ""; }

  if (editingCustomPeriodId) {
    const slot = (Array.isArray(state.timetable) ? state.timetable : []).find((t) => t.id === editingCustomPeriodId);
    if (slot) { Object.assign(slot, candidate); }
  } else {
    state.timetable.push(candidate);
  }
  persistState("timetable");
  resetCustomPeriodForm();
  renderTimetable();
  renderCustomPeriodList();
  renderAttendanceTable();
  renderDashboard();
}

let editingCustomPeriodId = null;

function resetCustomPeriodForm() {
  editingCustomPeriodId = null;
  const form = document.getElementById("custom-period-form");
  if (!form) { return; }
  form.reset();
  const cpErrorEl = document.getElementById("cp-error");
  if (cpErrorEl) { cpErrorEl.textContent = ""; }
  const submitBtn = document.getElementById("cp-submit");
  if (submitBtn) { submitBtn.textContent = "Add Period"; }
}

function renderCustomPeriodList() {
  const container = document.getElementById("custom-period-list");
  container.textContent = "";
  const customs = (Array.isArray(state.timetable) ? state.timetable : []).filter((t) => !t.isDefault);
  if (!customs.length) {
    const empty = makeEl("p", "empty-state", "No custom periods added yet.");
    container.appendChild(empty);
    return;
  }
  customs.forEach((slot) => {
    const item = makeEl("div", "custom-period-item");
    const text = makeEl("div", null, slot.subject + " · " + slot.day + " " + slot.startTime + "–" + slot.endTime + (slot.room ? " · " + slot.room : ""));
    item.appendChild(text);
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-ghost btn-sm";
    editBtn.textContent = "Edit";
    editBtn.dataset.action = "edit";
    editBtn.dataset.id = slot.id;
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-danger btn-sm";
    delBtn.textContent = "Delete";
    delBtn.dataset.action = "delete";
    delBtn.dataset.id = slot.id;
    item.appendChild(editBtn);
    item.appendChild(delBtn);
    container.appendChild(item);
  });
}

document.getElementById("custom-period-list").addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) { return; }
  const action = btn.getAttribute("data-action");
  const id = btn.getAttribute("data-id");
  if (action === "delete") {
    state.timetable = (Array.isArray(state.timetable) ? state.timetable : []).filter((t) => t.id !== id);
    persistState("timetable");
    renderTimetable();
    renderCustomPeriodList();
    renderAttendanceTable();
    renderDashboard();
  }
  if (action === "edit") {
    const slot = (Array.isArray(state.timetable) ? state.timetable : []).find((t) => t.id === id);
    if (slot) {
      editingCustomPeriodId = id;
      document.getElementById("cp-subject").value = slot.subject || "";
      document.getElementById("cp-code").value = slot.code || "";
      document.getElementById("cp-day").value = slot.day || "Mon";
      document.getElementById("cp-start").value = slot.startTime || "";
      document.getElementById("cp-end").value = slot.endTime || "";
      document.getElementById("cp-room").value = slot.room || "";
      document.getElementById("cp-instructor").value = slot.instructor || "";
      document.getElementById("cp-type").value = slot.type || "Lecture";
      const submitBtn = document.getElementById("cp-submit");
      if (submitBtn) { submitBtn.textContent = "Save Changes"; }
      document.getElementById("custom-period-form").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
});

/* ---------- 14. Notes module ---------- */
let editingNoteId = null;
let noteSearch = "";

function noteMatchesSearch(note) {
  const q = noteSearch.trim().toLowerCase();
  if (!q) { return true; }
  return (String(note.title) + " " + String(note.subject || "") + " " + String(note.body || "")).toLowerCase().indexOf(q) > -1;
}

function renderNotes() {
  const grid = document.getElementById("note-grid");
  grid.textContent = "";
  const notes = (Array.isArray(state.notes) ? state.notes : []).filter(noteMatchesSearch);
  notes.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  if (!notes.length) {
    grid.appendChild(makeEl("p", "empty-state", noteSearch.trim() ? "No notes match this search." : "No notes yet. Write your first study note above."));
  }
  notes.forEach((note) => {
    const card = makeEl("article", "note-card");
    card.setAttribute("data-color", note.color || "amber");
    const subject = makeEl("div", "note-subject", note.subject || "General");
    const title = makeEl("h3", null, note.title);
    card.appendChild(subject);
    card.appendChild(title);
    const body = makeEl("p", "note-body", note.body || "");
    const rawBody = String(note.body || "");
    if (rawBody.length > 140) { body.textContent = rawBody.slice(0, 140) + "…"; }
    card.appendChild(body);
    const updatedLabel = /^\d{4}-\d{2}-\d{2}$/.test(String(note.updatedAt || ""))
      ? "Updated " + formatLongDate(note.updatedAt)
      : "Updated " + (note.updatedAt || "recently");
    const updated = makeEl("div", "note-updated", updatedLabel);
    card.appendChild(updated);
    const actions = makeEl("div", "note-actions");
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.dataset.action = "edit";
    editBtn.dataset.id = note.id;
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "Delete";
    delBtn.dataset.action = "delete";
    delBtn.dataset.id = note.id;
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

function handleNoteSubmit(event) {
  event.preventDefault();
  const title = document.getElementById("note-title").value.trim();
  const subject = document.getElementById("note-subject").value.trim();
  const color = document.getElementById("note-color").value;
  const body = document.getElementById("note-body").value.trim();

  let ok = true;
  const titleMsg = title.length < 1 ? "Title is required." : "";
  setTaskError("note-error-title", titleMsg);
  if (titleMsg) { ok = false; }
  const bodyMsg = body.length < 1 ? "Note body is required." : "";
  setTaskError("note-error-body", bodyMsg);
  if (bodyMsg) { ok = false; }

  if (!ok) { return; }

  const now = getTodayKey();
  if (editingNoteId) {
    const note = (Array.isArray(state.notes) ? state.notes : []).find((n) => n.id === editingNoteId);
    if (note) { Object.assign(note, { title: title, subject: subject, color: color, body: body, updatedAt: now }); }
  } else {
    state.notes.push({ id: createId("note"), title: title, subject: subject, color: color, body: body, updatedAt: now });
  }
  persistState("notes");
  resetNoteForm();
  renderNotes();
}

function resetNoteForm() {
  editingNoteId = null;
  const form = document.getElementById("note-form");
  if (!form) { return; }
  form.reset();
  setTaskError("note-error-title", "");
  setTaskError("note-error-body", "");
  document.getElementById("note-submit").textContent = "Save Note";
  const cancelBtn = document.getElementById("note-cancel-edit");
  if (cancelBtn) { cancelBtn.hidden = true; }
}

function openNoteDialog(id) {
  const note = (Array.isArray(state.notes) ? state.notes : []).find((n) => n.id === id);
  if (!note) { return; }
  document.getElementById("note-dialog-message").textContent = "Delete note \"" + note.title + "\"? This cannot be undone.";
  document.getElementById("note-confirm").dataset.id = id;
  document.getElementById("dialog-note").showModal();
}

function confirmDeleteNote() {
  const id = document.getElementById("note-confirm").dataset.id;
  state.notes = (Array.isArray(state.notes) ? state.notes : []).filter((n) => n.id !== id);
  persistState("notes");
  document.getElementById("dialog-note").close();
  renderNotes();
}

/* ---------- 15. Resources module ---------- */
let editingResourceId = null;

function resourceMatchesSearch(resource) {
  const q = document.getElementById("resource-search").value.trim().toLowerCase();
  const category = document.getElementById("resource-category-filter").value;
  if (category && resource.category !== category) { return false; }
  if (q) { return (String(resource.title) + " " + String(resource.category) + " " + String(resource.description || "")).toLowerCase().indexOf(q) > -1; }
  return true;
}

function renderResources() {
  const grid = document.getElementById("resource-grid");
  const select = document.getElementById("resource-category-filter");
  const previous = select.value;
  const searchText = document.getElementById("resource-search").value.trim();
  grid.textContent = "";
  const resources = (Array.isArray(state.resources) ? state.resources : []).filter(resourceMatchesSearch);

  select.textContent = "";
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All categories";
  select.appendChild(allOption);
  const categories = [];
  (Array.isArray(state.resources) ? state.resources : []).forEach((r) => {
    if (r.category && categories.indexOf(r.category) === -1) { categories.push(r.category); }
  });
  categories.sort((a, b) => a.localeCompare(b));
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat === previous) { opt.selected = true; }
    select.appendChild(opt);
  });
  if (!previous || categories.indexOf(previous) === -1) { allOption.selected = true; }

  if (!resources.length) {
    const message = searchText || previous
      ? "No bookmarks match this search or category."
      : "No bookmarks yet. Add your first study resource above.";
    grid.appendChild(makeEl("p", "empty-state", message));
  }
  resources.forEach((resource) => {
    const card = makeEl("article", "resource-card");
    const title = makeEl("h3", null, resource.title);
    const desc = makeEl("p", null, resource.description || "");
    const link = document.createElement("a");
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = resource.url;
    const actions = makeEl("div", "task-actions");
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-ghost btn-sm";
    editBtn.textContent = "Edit";
    editBtn.dataset.action = "edit";
    editBtn.dataset.id = resource.id;
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-danger btn-sm";
    delBtn.textContent = "Delete";
    delBtn.dataset.action = "delete";
    delBtn.dataset.id = resource.id;
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(link);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

function openResourceDialog(id) {
  const resource = (Array.isArray(state.resources) ? state.resources : []).find((r) => r.id === id);
  if (!resource) { return; }
  document.getElementById("res-dialog-message").textContent = "Delete bookmark \"" + resource.title + "\"? This cannot be undone.";
  document.getElementById("res-confirm").dataset.id = id;
  document.getElementById("dialog-resource").showModal();
}

function confirmDeleteResource() {
  const id = document.getElementById("res-confirm").dataset.id;
  state.resources = (Array.isArray(state.resources) ? state.resources : []).filter((r) => r.id !== id);
  persistState("resources");
  document.getElementById("dialog-resource").close();
  const filter = document.getElementById("resource-category-filter");
  if (filter) { filter.value = ""; }
  renderResources();
  showToast("Bookmark deleted.");
}

function handleResourceSubmit(event) {
  event.preventDefault();
  const title = document.getElementById("resource-title").value.trim();
  const url = document.getElementById("resource-url").value.trim();
  const category = document.getElementById("resource-category").value.trim();
  const description = document.getElementById("resource-description").value.trim();

  let ok = true;
  const titleMsg = title.length < 1 ? "Title is required." : "";
  setTaskError("resource-error-title", titleMsg);
  if (titleMsg) { ok = false; }
  setTaskError("resource-error-url", "");
  if (!url) {
    setTaskError("resource-error-url", "URL is required.");
    ok = false;
  } else {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") { throw new Error("bad protocol"); }
    } catch (err) {
      setTaskError("resource-error-url", "Only http:// and https:// URLs are allowed.");
      ok = false;
    }
  }

  if (!ok) { return; }

  if (editingResourceId) {
    const resource = (Array.isArray(state.resources) ? state.resources : []).find((r) => r.id === editingResourceId);
    if (resource) { Object.assign(resource, { title: title, url: url, category: category, description: description }); }
  } else {
    state.resources.push({ id: createId("res"), title: title, url: url, category: category, description: description, createdAt: getTodayKey() });
  }
  persistState("resources");
  resetResourceForm();
  document.getElementById("resource-category-filter").value = "";
  renderResources();
}

function setResourceEditing(id) {
  const resource = (Array.isArray(state.resources) ? state.resources : []).find((r) => r.id === id);
  if (!resource) { return; }
  editingResourceId = id;
  document.getElementById("resource-title").value = resource.title || "";
  document.getElementById("resource-url").value = resource.url || "";
  document.getElementById("resource-category").value = resource.category || "";
  document.getElementById("resource-description").value = resource.description || "";
  document.getElementById("resource-submit").textContent = "Save Changes";
  const cancelBtn = document.getElementById("resource-cancel-edit");
  if (cancelBtn) { cancelBtn.hidden = false; }
  document.getElementById("resource-form").scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetResourceForm() {
  editingResourceId = null;
  const form = document.getElementById("resource-form");
  if (!form) { return; }
  form.reset();
  setTaskError("resource-error-title", "");
  setTaskError("resource-error-url", "");
  document.getElementById("resource-submit").textContent = "Add Resource";
  const cancelBtn = document.getElementById("resource-cancel-edit");
  if (cancelBtn) { cancelBtn.hidden = true; }
}

/* ---------- 16. Focus timer & study audio ---------- */
const FOCUS_PRESETS = [
  { id: "sprint", label: "15:00 Sprint", seconds: 900 },
  { id: "focus", label: "25:00 Focus", seconds: 1500 },
  { id: "deep", label: "45:00 Deep Work", seconds: 2700 },
];

const focusState = { seconds: 1500, remaining: 1500, running: false };
let focusInterval = null;

function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

function renderFocus() {
  const display = document.getElementById("focus-display");
  if (display) { display.textContent = formatClock(focusState.remaining); }
  const startBtn = document.getElementById("focus-startpause");
  if (startBtn) { startBtn.textContent = focusState.running ? "Pause" : "Start"; }
  const presets = document.querySelectorAll("#focus-presets .chip");
  presets.forEach((chip) => {
    chip.classList.toggle("active", Number(chip.getAttribute("data-seconds")) === focusState.seconds);
  });
  updateFocusHeroStatus();
}

function tickFocus() {
  focusState.remaining -= 1;
  renderFocus();
  if (focusState.remaining <= 0) {
    focusState.remaining = 0;
    focusState.running = false;
    if (focusInterval) { clearInterval(focusInterval); focusInterval = null; }
    const startBtn = document.getElementById("focus-startpause");
    if (startBtn) { startBtn.textContent = "Start"; }
    showToast("Focus session complete — take a short break.");
  }
}

function startPauseFocus() {
  if (focusState.running) {
    focusState.running = false;
    if (focusInterval) { clearInterval(focusInterval); focusInterval = null; }
    renderFocus();
    return;
  }
  if (focusState.remaining <= 0) { focusState.remaining = focusState.seconds; }
  focusState.running = true;
  const startBtn = document.getElementById("focus-startpause");
  if (startBtn) { startBtn.textContent = "Pause"; }
  focusInterval = setInterval(tickFocus, 1000);
}

function resetFocus() {
  focusState.remaining = focusState.seconds;
  focusState.running = false;
  if (focusInterval) { clearInterval(focusInterval); focusInterval = null; }
  renderFocus();
}

function updateFocusHeroStatus() {
  const hero = document.getElementById("focus-hero-status");
  if (!hero) { return; }
  const prefs = getAudioPrefs();
  const track = STUDY_TRACKS.filter((t) => t.id === prefs.trackId).shift() || STUDY_TRACKS[0];
  const playback = audio && !audio.paused ? "Playing" : "Paused";
  hero.textContent = formatClock(focusState.remaining) + " · " + track.name + " · " + playback;
}

/* ---------- 17. Study audio ---------- */
const STUDY_TRACKS = [
  { id: "rain-study", name: "Rain on Campus Roof", file: "assets/audio/rain-study.mp3" },
  { id: "lofi-calm", name: "Midnight Lo-Fi Study", file: "assets/audio/lofi-calm.mp3" },
  { id: "ambient-pad", name: "Warm Ambient Synth", file: "assets/audio/ambient-pad.mp3" },
];

const audio = document.getElementById("study-audio");
const audioErrorEl = document.getElementById("audio-error");

function getAudioPrefs() {
  if (!state.audioPrefs || typeof state.audioPrefs !== "object") {
    state.audioPrefs = { trackId: "rain-study", loop: true, volume: 0.65 };
  }
  if (!STUDY_TRACKS.some((t) => t.id === state.audioPrefs.trackId)) { state.audioPrefs.trackId = "rain-study"; }
  if (typeof state.audioPrefs.loop !== "boolean") { state.audioPrefs.loop = true; }
  if (typeof state.audioPrefs.volume !== "number") { state.audioPrefs.volume = 0.65; }
  return state.audioPrefs;
}

function showAudioError(message) {
  if (!audioErrorEl) { return; }
  audioErrorEl.textContent = message;
  audioErrorEl.hidden = false;
}

function hideAudioError() {
  if (!audioErrorEl) { return; }
  audioErrorEl.hidden = true;
  audioErrorEl.textContent = "";
}

function syncAudioControls() {
  if (!audio) { return; }
  const prefs = getAudioPrefs();
  const track = STUDY_TRACKS.filter((t) => t.id === prefs.trackId).shift() || STUDY_TRACKS[0];
  audio.dataset.track = track.id;
  audio.src = track.file;
  audio.loop = prefs.loop === true;
  audio.volume = Math.max(0, Math.min(1, prefs.volume));
  const volumeSlider = document.getElementById("volume-slider");
  if (volumeSlider) { volumeSlider.value = String(Math.round(audio.volume * 100)); }
  const loopToggle = document.getElementById("loop-toggle");
  if (loopToggle) { loopToggle.checked = audio.loop; }
  const radioIds = { "rain-study": "track-rain", "lofi-calm": "track-lofi", "ambient-pad": "track-ambient" };
  const radio = document.getElementById(radioIds[track.id]);
  if (radio) { radio.checked = true; }
  hideAudioError();
}

function playStudyAudio() {
  const prefs = getAudioPrefs();
  const track = STUDY_TRACKS.filter((t) => t.id === prefs.trackId).shift() || STUDY_TRACKS[0];
  if (audio.dataset.track !== track.id) { audio.dataset.track = track.id; audio.src = track.file; }
  audio.loop = prefs.loop === true;
  audio.volume = Math.max(0, Math.min(1, prefs.volume));
  try {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.then(hideAudioError).catch(() => {
        showAudioError("Study audio could not start. Press Play again or confirm the MP3 exists inside assets/audio/.");
      });
    }
  } catch (err) {
    showAudioError("Study audio could not start. Confirm the MP3 exists inside assets/audio/ and press Play.");
  }
}

function toggleStudyAudio() {
  if (audio.paused) { playStudyAudio(); } else { audio.pause(); }
}

function renderAudioStatus() {
  const status = document.getElementById("audio-status");
  if (!status || !audio) { return; }
  const prefs = getAudioPrefs();
  const track = STUDY_TRACKS.filter((t) => t.id === prefs.trackId).shift() || STUDY_TRACKS[0];
  const playing = !audio.paused;
  status.textContent = "Track: " + track.name + " · Loop " + (prefs.loop === true ? "on" : "off") + " · Volume " + Math.round((typeof prefs.volume === "number" ? prefs.volume : 0.65) * 100) + "% · " + (playing ? "Playing" : "Paused");
}

function initAudio() {
  if (!audio) { return; }
  syncAudioControls();
  audio.addEventListener("play", () => {
    const btn = document.getElementById("audio-playpause");
    if (btn) { btn.textContent = "Pause"; }
    hideAudioError();
    renderAudioStatus();
    updateFocusHeroStatus();
  });
  audio.addEventListener("pause", () => {
    const btn = document.getElementById("audio-playpause");
    if (btn) { btn.textContent = "Play"; }
    renderAudioStatus();
    updateFocusHeroStatus();
  });
  audio.addEventListener("canplay", hideAudioError);
  audio.addEventListener("ended", () => { if (audio.loop) { playStudyAudio(); } });
  audio.addEventListener("error", () => {
    showAudioError("Study audio file not found. Place your royalty-free MP3 track inside assets/audio/ and press Play.");
  });
}

/* ---------- 18. Preferences ---------- */
function openPrefs() {
  const modal = document.getElementById("prefs-modal");
  if (!modal) { return; }
  document.getElementById("prefs-display-name").value = state.prefs.displayName || "";
  document.getElementById("prefs-theme").value = state.prefs.theme === "dark" ? "dark" : "light";
  document.getElementById("prefs-attendance-target").value = String(Number(state.prefs.attendanceTargetPct) || 75);
  modal.showModal();
}
function closePrefs() { const modal = document.getElementById("prefs-modal"); if (modal) { modal.close(); } }

function handlePrefsSubmit(event) {
  event.preventDefault();
  const displayName = document.getElementById("prefs-display-name").value.trim();
  const theme = document.getElementById("prefs-theme").value;
  const attendanceTarget = Number(document.getElementById("prefs-attendance-target").value);
  state.prefs.displayName = displayName || state.prefs.displayName || "Student";
  state.prefs.theme = theme;
  state.prefs.attendanceTargetPct = isNaN(attendanceTarget) ? 75 : Math.max(50, Math.min(100, attendanceTarget));
  persistState("prefs");
  applyTheme(state.prefs.theme);
  renderDashboard();
  renderAttendanceTable();
  closePrefs();
  showToast("Preferences saved.");
}

function openResetDialog() {
  closePrefs();
  const modal = document.getElementById("dialog-reset");
  if (modal) { modal.showModal(); }
}
function closeResetDialog() { const modal = document.getElementById("dialog-reset"); if (modal) { modal.close(); } }
function confirmReset() {
  clearUniDeskKeys();
  state.prefs = { displayName: "Amritesh", theme: "light", attendanceTargetPct: 75 };
  state.tasks = seedTasks();
  state.timetable = seedTimetable();
  state.attendance = {};
  state.notes = seedNotes();
  state.resources = seedResources();
  state.audioPrefs = { trackId: "rain-study", loop: true, volume: 0.65 };
  attendanceDateKey = getTodayKey();
  const attendanceDateEl = document.getElementById("attendance-date");
  if (attendanceDateEl) { attendanceDateEl.value = attendanceDateKey; }
  if (focusInterval) { clearInterval(focusInterval); focusInterval = null; }
  focusState.seconds = 1500;
  focusState.remaining = 1500;
  focusState.running = false;
  if (audio) { audio.pause(); audio.currentTime = 0; audio.dataset.track = ""; }
  persistAll();
  syncAudioControls();
  applyTheme(state.prefs.theme);
  closeResetDialog();
  closePrefs();
  renderAll();
  showToast("UniDesk data has been reset.");
}

/* ---------- 19. Render orchestration ---------- */
function renderAll() {
  renderDashboard();
  renderTasks();
  renderTimetable();
  renderCustomPeriodList();
  renderAttendanceTable();
  renderNotes();
  renderResources();
  renderFocus();
  renderAudioStatus();
}

/* ---------- 20. Event wiring ---------- */
function init() {
  initTheme();
  initAudio();
  const rawHash = window.location.hash.replace("#", "");
  const initialName = rawHash.startsWith("sec-") ? rawHash.slice(4) : rawHash;
  const initialSection = document.getElementById("sec-" + (NAV_SECTIONS.includes(initialName) ? initialName : "dashboard"));
  document.querySelectorAll("section.module").forEach((section) => { section.classList.remove("module-active"); });
  if (initialSection) {
    initialSection.classList.add("module-active");
    updateNavActive(initialSection.id);
  }

  const taskForm = document.getElementById("task-form");
  taskForm.addEventListener("submit", handleTaskSubmit);
  const taskCancelEdit = document.getElementById("task-cancel-edit");
  taskCancelEdit.addEventListener("click", (e) => { e.preventDefault(); resetTaskForm(); });

  const taskFilters = document.getElementById("task-filters");
  taskFilters.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip[data-filter]");
    if (!chip) { return; }
    taskFilter = chip.getAttribute("data-filter");
    taskFilters.querySelectorAll(".chip").forEach((c) => { c.classList.toggle("active", c.getAttribute("data-filter") === taskFilter); });
    renderTasks();
  });

  const taskSearchEl = document.getElementById("task-search");
  taskSearchEl.addEventListener("input", () => { taskSearch = taskSearchEl.value; renderTasks(); });

  const taskSortEl = document.getElementById("task-sort");
  taskSortEl.addEventListener("change", () => { taskSort = taskSortEl.value; renderTasks(); });

  document.getElementById("task-list").addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) { return; }
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (action === "edit") { setTaskEditing(id); }
    if (action === "delete") { openTaskDialog(id); }
  });

  document.getElementById("task-confirm").addEventListener("click", () => { confirmDeleteTask(); });
  const taskDialog = document.getElementById("dialog-task");
  const taskCancelBtn = document.getElementById("task-cancel");
  taskCancelBtn.addEventListener("click", () => { taskDialog.close(); });

  const restoreDefaultBtn = document.getElementById("restore-default");
  restoreDefaultBtn.addEventListener("click", () => {
    const dialog = document.getElementById("dialog-restore");
    if (dialog) { dialog.showModal(); }
  });
  const restoreConfirm = document.getElementById("restore-confirm");
  restoreConfirm.addEventListener("click", () => {
    state.timetable = seedTimetable();
    persistState("timetable");
    document.getElementById("dialog-restore").close();
    renderTimetable();
    renderCustomPeriodList();
    renderAttendanceTable();
    renderDashboard();
    showToast("Default college routine restored.");
  });
  const restoreCancel = document.getElementById("restore-cancel");
  restoreCancel.addEventListener("click", () => { document.getElementById("dialog-restore").close(); });

  const customForm = document.getElementById("custom-period-form");
  customForm.addEventListener("submit", handleCustomPeriodSubmit);

  const noteForm = document.getElementById("note-form");
  noteForm.addEventListener("submit", handleNoteSubmit);
  const noteCancelEdit = document.getElementById("note-cancel-edit");
  noteCancelEdit.addEventListener("click", (e) => { e.preventDefault(); resetNoteForm(); });
  const noteSearchEl = document.getElementById("note-search");
  noteSearchEl.addEventListener("input", () => { noteSearch = noteSearchEl.value; renderNotes(); });
  document.getElementById("note-grid").addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) { return; }
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (action === "edit") {
      const note = (Array.isArray(state.notes) ? state.notes : []).find((n) => n.id === id);
      if (!note) { return; }
      editingNoteId = id;
      document.getElementById("note-title").value = note.title || "";
      document.getElementById("note-subject").value = note.subject || "";
      document.getElementById("note-color").value = note.color || "amber";
      document.getElementById("note-body").value = note.body || "";
      document.getElementById("note-submit").textContent = "Save Changes";
      const cancelBtn = document.getElementById("note-cancel-edit");
      if (cancelBtn) { cancelBtn.hidden = false; }
      document.getElementById("note-form").scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (action === "delete") { openNoteDialog(id); }
  });

  document.getElementById("note-confirm").addEventListener("click", () => { confirmDeleteNote(); });
  const noteDialog = document.getElementById("dialog-note");
  document.getElementById("note-cancel").addEventListener("click", () => { noteDialog.close(); });

  const resourceForm = document.getElementById("resource-form");
  resourceForm.addEventListener("submit", handleResourceSubmit);
  const resourceCancelEdit = document.getElementById("resource-cancel-edit");
  resourceCancelEdit.addEventListener("click", (e) => { e.preventDefault(); resetResourceForm(); });
  const resourceSearchEl = document.getElementById("resource-search");
  resourceSearchEl.addEventListener("input", () => { renderResources(); });
  const resourceCategoryFilter = document.getElementById("resource-category-filter");
  resourceCategoryFilter.addEventListener("change", () => { renderResources(); });
  document.getElementById("resource-grid").addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) { return; }
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (action === "edit") { setResourceEditing(id); }
    if (action === "delete") { openResourceDialog(id); }
  });

  document.getElementById("res-confirm").addEventListener("click", () => { confirmDeleteResource(); });
  const resourceDialog = document.getElementById("dialog-resource");
  document.getElementById("res-cancel").addEventListener("click", () => { resourceDialog.close(); });

  const focusStartPause = document.getElementById("focus-startpause");
  focusStartPause.addEventListener("click", () => { startPauseFocus(); });
  const focusReset = document.getElementById("focus-reset");
  focusReset.addEventListener("click", () => { resetFocus(); });
  const focusPresets = document.getElementById("focus-presets");
  focusPresets.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-seconds]");
    if (!btn) { return; }
    focusState.seconds = Number(btn.getAttribute("data-seconds"));
    focusState.remaining = focusState.seconds;
    focusState.running = false;
    if (focusInterval) { clearInterval(focusInterval); focusInterval = null; }
    renderFocus();
  });

  const audioPlayPause = document.getElementById("audio-playpause");
  audioPlayPause.addEventListener("click", () => { toggleStudyAudio(); });

  const volumeSlider = document.getElementById("volume-slider");
  volumeSlider.addEventListener("input", () => {
    const volume = Number(volumeSlider.value) / 100;
    state.audioPrefs.volume = volume;
    persistState("audioPrefs");
    audio.volume = volume;
    renderAudioStatus();
  });

  const loopToggle = document.getElementById("loop-toggle");
  loopToggle.addEventListener("change", () => {
    state.audioPrefs.loop = loopToggle.checked;
    persistState("audioPrefs");
    if (audio) { audio.loop = loopToggle.checked; }
    renderAudioStatus();
  });

  ["track-rain", "track-lofi", "track-ambient"].forEach((id) => {
    const radio = document.getElementById(id);
    if (!radio) { return; }
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.audioPrefs.trackId = radio.getAttribute("value");
        persistState("audioPrefs");
        playStudyAudio();
        renderAudioStatus();
      }
    });
  });

  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => { applyTheme(state.prefs.theme === "dark" ? "light" : "dark"); });

  const prefsOpen = document.getElementById("prefs-open");
  prefsOpen.addEventListener("click", () => { openPrefs(); });

  const prefsForm = document.getElementById("prefs-form");
  prefsForm.addEventListener("submit", handlePrefsSubmit);
  const prefsCancel = document.getElementById("prefs-cancel");
  prefsCancel.addEventListener("click", () => { closePrefs(); });

  const prefsResetOpen = document.getElementById("prefs-reset-open");
  prefsResetOpen.addEventListener("click", () => { openResetDialog(); });

  const resetConfirm = document.getElementById("reset-confirm");
  resetConfirm.addEventListener("click", () => { confirmReset(); });
  const resetCancel = document.getElementById("reset-cancel");
  resetCancel.addEventListener("click", () => { closeResetDialog(); });

  const attendanceDateEl = document.getElementById("attendance-date");
  attendanceDateEl.value = attendanceDateKey;
  attendanceDateEl.addEventListener("change", () => {
    attendanceDateKey = attendanceDateEl.value || getTodayKey();
    renderTimetable();
    renderAttendanceTable();
    renderDashboard();
  });

  const quickAddTask = document.getElementById("quick-add-task");
  if (quickAddTask) {
    quickAddTask.addEventListener("click", () => {
      showSection("sec-tasks");
      window.setTimeout(() => { document.getElementById("task-title").focus(); }, 80);
    });
  }

  const quickWriteNote = document.getElementById("quick-write-note");
  if (quickWriteNote) {
    quickWriteNote.addEventListener("click", () => {
      showSection("sec-notes");
      window.setTimeout(() => { document.getElementById("note-title").focus(); }, 80);
    });
  }

  document.querySelectorAll("a[data-nav]").forEach((link) => {
    link.addEventListener("click", handleNavClick);
  });

  window.addEventListener("hashchange", handleHashChange);

  renderAll();
  persistAll();
  if (initialSection && initialSection.id !== "sec-dashboard") { showSection(initialSection.id); }
}

document.addEventListener("DOMContentLoaded", init);
