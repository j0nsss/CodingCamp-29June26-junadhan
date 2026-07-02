/**
 * ================================================================
 * DASHBOARD PRODUKTIVITAS — app.js
 * Fitur: Greeting, Focus Timer (Pomodoro), To-Do List, Quick Links
 * Tantangan: Dark/Light Mode, Custom Name, Custom Timer Duration,
 *            Prevent Duplicate Tasks, Sort Tasks
 * Storage: LocalStorage (client-side only)
 * ================================================================
 */

/* ──────────────────────────────────────────────
   UTILITAS STORAGE
   ────────────────────────────────────────────── */
const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("LocalStorage write failed:", e);
    }
  },
};

/* ──────────────────────────────────────────────
   CONSTANTS
   ────────────────────────────────────────────── */
const STORAGE_KEYS = {
  THEME:  "prd_theme",
  NAME:   "prd_name",
  TODOS:  "prd_todos",
  LINKS:  "prd_links",
  TIMER_DURATION: "prd_timer_duration",
};

const CIRCUMFERENCE = 2 * Math.PI * 54; // r = 54 (matches SVG)

/* ──────────────────────────────────────────────
   1. THEME TOGGLE (Light / Dark)
   ────────────────────────────────────────────── */
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon      = document.getElementById("theme-icon");
const htmlEl         = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  Storage.set(STORAGE_KEYS.THEME, theme);
}

function initTheme() {
  const saved = Storage.get(STORAGE_KEYS.THEME, "light");
  applyTheme(saved);
}

themeToggleBtn.addEventListener("click", () => {
  const current = htmlEl.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ──────────────────────────────────────────────
   2. GREETING (Waktu, Tanggal, Nama, Ucapan)
   ────────────────────────────────────────────── */
const greetingTimeEl = document.getElementById("greeting-time");
const greetingTextEl = document.getElementById("greeting-text");
const greetingDateEl = document.getElementById("greeting-date");
const userNameInput  = document.getElementById("user-name-input");
const saveNameBtn    = document.getElementById("save-name-btn");

const DAYS_ID   = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni",
                   "Juli","Agustus","September","Oktober","November","Desember"];

function getGreetingWord(hour) {
  if (hour >= 5  && hour < 12) return "Selamat Pagi";
  if (hour >= 12 && hour < 15) return "Selamat Siang";
  if (hour >= 15 && hour < 19) return "Selamat Sore";
  return "Selamat Malam";
}

function getGreetingEmoji(hour) {
  if (hour >= 5  && hour < 12) return "🌤️";
  if (hour >= 12 && hour < 15) return "☀️";
  if (hour >= 15 && hour < 19) return "🌅";
  return "🌙";
}

function pad(n) { return String(n).padStart(2, "0"); }

function updateClock() {
  const now     = new Date();
  const hour    = now.getHours();
  const minute  = now.getMinutes();
  const name    = Storage.get(STORAGE_KEYS.NAME, "");
  const greeting = getGreetingWord(hour);
  const emoji    = getGreetingEmoji(hour);

  greetingTimeEl.textContent = `${pad(hour)}:${pad(minute)}`;
  greetingTextEl.textContent = name
    ? `${emoji} ${greeting}, ${name}!`
    : `${emoji} ${greeting}!`;

  const dateStr = `${DAYS_ID[now.getDay()]}, ${now.getDate()} ${MONTHS_ID[now.getMonth()]} ${now.getFullYear()}`;
  greetingDateEl.textContent = dateStr;
}

function initGreeting() {
  const savedName = Storage.get(STORAGE_KEYS.NAME, "");
  userNameInput.value = savedName;
  updateClock();
  setInterval(updateClock, 1000);
}

saveNameBtn.addEventListener("click", () => {
  const name = userNameInput.value.trim();
  Storage.set(STORAGE_KEYS.NAME, name);
  updateClock();
  showToast(saveNameBtn, name ? `Halo, ${name}! 👋` : "Nama dihapus.");
});

userNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveNameBtn.click();
});

/* ──────────────────────────────────────────────
   TOAST HELPER (inline feedback on button)
   ────────────────────────────────────────────── */
function showToast(anchorBtn, message) {
  const existing = document.getElementById("inline-toast");
  if (existing) existing.remove();

  const toast = document.createElement("span");
  toast.id = "inline-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 1.5rem; right: 1.5rem;
    background: var(--accent);
    color: white;
    padding: 0.55rem 1.1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    z-index: 999;
    animation: fadeSlideIn 0.2s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

/* ──────────────────────────────────────────────
   3. FOCUS TIMER (Pomodoro + Custom Duration)
   ────────────────────────────────────────────── */
const timerDisplayEl    = document.getElementById("timer-display");
const timerLabelEl      = document.getElementById("timer-label");
const timerDurationInput= document.getElementById("timer-duration");
const timerStartBtn     = document.getElementById("timer-start");
const timerStopBtn      = document.getElementById("timer-stop");
const timerResetBtn     = document.getElementById("timer-reset");
const timerRingProgress = document.getElementById("timer-ring-progress");
const timerNotifEl      = document.getElementById("timer-notification");

let timerInterval   = null;
let timerTotalSecs  = 25 * 60;
let timerRemaining  = timerTotalSecs;
let timerRunning    = false;

function timerFormat(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${pad(m)}:${pad(s)}`;
}

function updateRing(remaining, total) {
  const ratio  = remaining / total;
  const offset = CIRCUMFERENCE * (1 - ratio);
  timerRingProgress.style.strokeDashoffset = offset;

  timerRingProgress.classList.remove("low", "critical");
  if (ratio <= 0.1)       timerRingProgress.classList.add("critical");
  else if (ratio <= 0.25) timerRingProgress.classList.add("low");
}

function renderTimer() {
  timerDisplayEl.textContent = timerFormat(timerRemaining);
  updateRing(timerRemaining, timerTotalSecs);
}

function setTimerDuration(minutes) {
  const mins      = Math.max(1, Math.min(120, parseInt(minutes) || 25));
  timerTotalSecs  = mins * 60;
  timerRemaining  = timerTotalSecs;
  timerDurationInput.value = mins;
  Storage.set(STORAGE_KEYS.TIMER_DURATION, mins);
  renderTimer();
}

function timerStart() {
  if (timerRunning) return;
  // Apply any pending duration change only when not mid-session
  const inputMins = parseInt(timerDurationInput.value) || 25;
  if (timerRemaining === timerTotalSecs) {
    setTimerDuration(inputMins);
  }

  timerRunning = true;
  timerStartBtn.disabled = true;
  timerStopBtn.disabled  = false;
  timerDurationInput.disabled = true;
  timerNotifEl.classList.add("hidden");
  timerLabelEl.textContent = "Fokus";

  timerInterval = setInterval(() => {
    timerRemaining--;
    renderTimer();

    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerStartBtn.disabled = false;
      timerStopBtn.disabled  = true;
      timerDurationInput.disabled = false;
      timerLabelEl.textContent = "Selesai!";
      timerNotifEl.textContent = "🎉 Sesi fokus selesai! Saatnya istirahat.";
      timerNotifEl.classList.remove("hidden");

      // Browser notification (if permitted)
      if (Notification.permission === "granted") {
        new Notification("Focus Timer", {
          body: "Sesi Pomodoro selesai! Saatnya istirahat.",
          icon: "https://cdn.jsdelivr.net/npm/twemoji@14/assets/72x72/1f345.png",
        });
      }
    }
  }, 1000);
}

function timerStop() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  timerStartBtn.disabled = false;
  timerStopBtn.disabled  = true;
  timerLabelEl.textContent = "Dijeda";
}

function timerReset() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerStartBtn.disabled  = false;
  timerStopBtn.disabled   = true;
  timerDurationInput.disabled = false;
  timerLabelEl.textContent = "Fokus";
  timerNotifEl.classList.add("hidden");
  const mins = parseInt(timerDurationInput.value) || 25;
  setTimerDuration(mins);
}

function initTimer() {
  const savedMins = Storage.get(STORAGE_KEYS.TIMER_DURATION, 25);
  timerDurationInput.value = savedMins;
  setTimerDuration(savedMins);
  timerRingProgress.style.strokeDasharray = CIRCUMFERENCE;

  // Request notification permission passively
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

timerStartBtn.addEventListener("click", timerStart);
timerStopBtn.addEventListener("click",  timerStop);
timerResetBtn.addEventListener("click", timerReset);

timerDurationInput.addEventListener("change", () => {
  if (!timerRunning) {
    setTimerDuration(timerDurationInput.value);
  }
});

/* ──────────────────────────────────────────────
   4. TO-DO LIST (Add, Edit, Check, Delete,
      Prevent Duplicate, Sort)
   ────────────────────────────────────────────── */
const todoInput      = document.getElementById("todo-input");
const todoAddBtn     = document.getElementById("todo-add-btn");
const todoListEl     = document.getElementById("todo-list");
const todoEmpty      = document.getElementById("todo-empty");
const todoCounter    = document.getElementById("todo-counter");
const todoNotifEl    = document.getElementById("todo-notification");
const sortAlphaBtn   = document.getElementById("sort-alpha");
const sortPendingBtn = document.getElementById("sort-pending");

// Edit modal elements
const editModal     = document.getElementById("edit-modal");
const editTodoInput = document.getElementById("edit-todo-input");
const editSaveBtn   = document.getElementById("edit-save-btn");
const editCancelBtn = document.getElementById("edit-cancel-btn");

let todos        = [];
let editingId    = null;
let sortMode     = null; // null | "alpha" | "pending"

/* --- Data helpers --- */
function saveTodos() {
  Storage.set(STORAGE_KEYS.TODOS, todos);
}

function createTodo(text) {
  return { id: Date.now().toString(), text: text.trim(), done: false };
}

function isDuplicate(text) {
  return todos.some((t) => t.text.toLowerCase() === text.trim().toLowerCase());
}

/* --- Sort helpers --- */
function getSortedTodos() {
  const list = [...todos];
  if (sortMode === "alpha") {
    list.sort((a, b) => a.text.localeCompare(b.text, "id"));
  } else if (sortMode === "pending") {
    list.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return 0;
    });
  }
  return list;
}

/* --- Notification --- */
function showTodoNotif(message, isError = true) {
  todoNotifEl.textContent = message;
  todoNotifEl.style.background = isError
    ? "color-mix(in srgb, var(--danger) 12%, transparent)"
    : "color-mix(in srgb, var(--success) 12%, transparent)";
  todoNotifEl.style.color = isError ? "var(--danger)" : "var(--success)";
  todoNotifEl.classList.remove("hidden");
  clearTimeout(todoNotifEl._timer);
  todoNotifEl._timer = setTimeout(() => todoNotifEl.classList.add("hidden"), 3000);
}

/* --- Render --- */
function renderTodos() {
  const sorted = getSortedTodos();
  todoListEl.innerHTML = "";

  if (sorted.length === 0) {
    todoEmpty.classList.remove("hidden");
    todoCounter.textContent = "";
    return;
  }

  todoEmpty.classList.add("hidden");

  sorted.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item${todo.done ? " done" : ""}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <input
        type="checkbox"
        class="todo-checkbox"
        aria-label="Tandai selesai: ${todo.text}"
        ${todo.done ? "checked" : ""}
      />
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <div class="todo-actions">
        <button class="todo-btn edit"   title="Edit tugas"  aria-label="Edit: ${todo.text}">✏️</button>
        <button class="todo-btn delete" title="Hapus tugas" aria-label="Hapus: ${todo.text}">🗑️</button>
      </div>
    `;

    // Checkbox toggle
    li.querySelector(".todo-checkbox").addEventListener("change", () => toggleTodo(todo.id));
    // Edit
    li.querySelector(".todo-btn.edit").addEventListener("click", () => openEditModal(todo.id));
    // Delete
    li.querySelector(".todo-btn.delete").addEventListener("click", () => deleteTodo(todo.id));

    todoListEl.appendChild(li);
  });

  const doneCount = todos.filter((t) => t.done).length;
  todoCounter.textContent = `${doneCount}/${todos.length} selesai`;
}

/* --- CRUD --- */
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) {
    showTodoNotif("Tugas tidak boleh kosong!");
    todoInput.focus();
    return;
  }
  if (isDuplicate(text)) {
    showTodoNotif(`⚠️ Tugas "${text}" sudah ada dalam daftar!`);
    todoInput.select();
    return;
  }
  todos.push(createTodo(text));
  saveTodos();
  renderTodos();
  todoInput.value = "";
  todoInput.focus();
  showTodoNotif("✅ Tugas berhasil ditambahkan!", false);
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

/* --- Edit Modal --- */
function openEditModal(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  editingId = id;
  editTodoInput.value = todo.text;
  editModal.classList.remove("hidden");
  editTodoInput.focus();
  editTodoInput.select();
}

function closeEditModal() {
  editModal.classList.add("hidden");
  editingId = null;
}

function saveEdit() {
  const newText = editTodoInput.value.trim();
  if (!newText) {
    editTodoInput.focus();
    return;
  }

  const todo = todos.find((t) => t.id === editingId);
  if (!todo) return;

  // Duplicate check (exclude self)
  const duplicate = todos.some(
    (t) => t.id !== editingId && t.text.toLowerCase() === newText.toLowerCase()
  );
  if (duplicate) {
    editTodoInput.setCustomValidity("Duplikat");
    showTodoNotif(`⚠️ Tugas "${newText}" sudah ada dalam daftar!`);
    return;
  }

  todo.text = newText;
  saveTodos();
  renderTodos();
  closeEditModal();
}

editSaveBtn.addEventListener("click",   saveEdit);
editCancelBtn.addEventListener("click", closeEditModal);

editTodoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter")  saveEdit();
  if (e.key === "Escape") closeEditModal();
});

editModal.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

/* --- Sort --- */
function setSortMode(mode) {
  sortMode = sortMode === mode ? null : mode;
  sortAlphaBtn.classList.toggle("btn-primary", sortMode === "alpha");
  sortAlphaBtn.classList.toggle("btn-outline",  sortMode !== "alpha");
  sortPendingBtn.classList.toggle("btn-primary", sortMode === "pending");
  sortPendingBtn.classList.toggle("btn-outline",  sortMode !== "pending");
  renderTodos();
}

sortAlphaBtn.addEventListener("click",   () => setSortMode("alpha"));
sortPendingBtn.addEventListener("click", () => setSortMode("pending"));

/* --- Init --- */
function initTodos() {
  todos = Storage.get(STORAGE_KEYS.TODOS, []);
  renderTodos();
}

todoAddBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

/* ──────────────────────────────────────────────
   5. QUICK LINKS (Add, Delete, Open)
   ────────────────────────────────────────────── */
const linkForm        = document.getElementById("link-form");
const linkLabelInput  = document.getElementById("link-label");
const linkUrlInput    = document.getElementById("link-url");
const linksContainer  = document.getElementById("links-container");
const linksEmpty      = document.getElementById("links-empty");
const linkNotifEl     = document.getElementById("link-notification");

let links = [];

function saveLinks() {
  Storage.set(STORAGE_KEYS.LINKS, links);
}

function showLinkNotif(message, isError = true) {
  linkNotifEl.textContent = message;
  linkNotifEl.style.background = isError
    ? "color-mix(in srgb, var(--danger) 12%, transparent)"
    : "color-mix(in srgb, var(--success) 12%, transparent)";
  linkNotifEl.style.color = isError ? "var(--danger)" : "var(--success)";
  linkNotifEl.classList.remove("hidden");
  clearTimeout(linkNotifEl._timer);
  linkNotifEl._timer = setTimeout(() => linkNotifEl.classList.add("hidden"), 3000);
}

function normalizeUrl(url) {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return "https://" + trimmed;
  return trimmed;
}

function getFavicon(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  } catch {
    return null;
  }
}

function renderLinks() {
  linksContainer.innerHTML = "";
  if (links.length === 0) {
    linksEmpty.classList.remove("hidden");
    return;
  }
  linksEmpty.classList.add("hidden");

  links.forEach((link) => {
    const chip = document.createElement("div");
    chip.className = "link-chip";
    chip.setAttribute("role", "group");

    const favicon = getFavicon(link.url);
    const imgTag  = favicon
      ? `<img src="${escapeHtml(favicon)}" alt="" width="14" height="14" style="border-radius:2px;flex-shrink:0" onerror="this.style.display='none'">`
      : "";

    chip.innerHTML = `
      ${imgTag}
      <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer"
         style="color:inherit;text-decoration:none;" title="${escapeHtml(link.url)}">
        ${escapeHtml(link.label)}
      </a>
      <button class="link-delete-btn" title="Hapus link" aria-label="Hapus ${escapeHtml(link.label)}">✕</button>
    `;

    chip.querySelector(".link-delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteLink(link.id);
    });

    linksContainer.appendChild(chip);
  });
}

function addLink(e) {
  e.preventDefault();
  const label = linkLabelInput.value.trim();
  const rawUrl = linkUrlInput.value.trim();

  if (!label || !rawUrl) {
    showLinkNotif("Nama dan URL wajib diisi!");
    return;
  }

  const url = normalizeUrl(rawUrl);

  try { new URL(url); } catch {
    showLinkNotif("URL tidak valid. Contoh: https://github.com");
    linkUrlInput.focus();
    return;
  }

  links.push({ id: Date.now().toString(), label, url });
  saveLinks();
  renderLinks();
  linkLabelInput.value = "";
  linkUrlInput.value   = "";
  linkLabelInput.focus();
  showLinkNotif(`🔗 "${label}" ditambahkan!`, false);
}

function deleteLink(id) {
  links = links.filter((l) => l.id !== id);
  saveLinks();
  renderLinks();
}

function initLinks() {
  links = Storage.get(STORAGE_KEYS.LINKS, []);
  renderLinks();
}

linkForm.addEventListener("submit", addLink);

/* ──────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ──────────────────────────────────────────────
   BOOTSTRAP — Jalankan semua inisialisasi
   ────────────────────────────────────────────── */
(function init() {
  initTheme();
  initGreeting();
  initTimer();
  initTodos();
  initLinks();
})();
