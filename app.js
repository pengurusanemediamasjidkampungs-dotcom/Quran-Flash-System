const KEY_READ_LOG = 'quran_read_log';
const KEY_PREFS = 'quran_prefs';

const prefs = JSON.parse(localStorage.getItem(KEY_PREFS) || '{}');

const JUZ = [
  { start: { surah: 1, ayah: 1 }, end: { surah: 2, ayah: 141 } },
  { start: { surah: 2, ayah: 142 }, end: { surah: 2, ayah: 252 } },
  { start: { surah: 2, ayah: 253 }, end: { surah: 3, ayah: 92 } },
  { start: { surah: 3, ayah: 93 }, end: { surah: 4, ayah: 23 } },
  { start: { surah: 4, ayah: 24 }, end: { surah: 4, ayah: 147 } },
  { start: { surah: 4, ayah: 148 }, end: { surah: 5, ayah: 81 } },
  { start: { surah: 5, ayah: 82 }, end: { surah: 6, ayah: 110 } },
  { start: { surah: 6, ayah: 111 }, end: { surah: 7, ayah: 87 } },
  { start: { surah: 7, ayah: 88 }, end: { surah: 8, ayah: 40 } },
  { start: { surah: 8, ayah: 41 }, end: { surah: 9, ayah: 92 } },
  { start: { surah: 9, ayah: 93 }, end: { surah: 11, ayah: 5 } },
  { start: { surah: 11, ayah: 6 }, end: { surah: 12, ayah: 52 } },
  { start: { surah: 12, ayah: 53 }, end: { surah: 14, ayah: 52 } },
  { start: { surah: 15, ayah: 1 }, end: { surah: 16, ayah: 128 } },
  { start: { surah: 17, ayah: 1 }, end: { surah: 18, ayah: 74 } },
  { start: { surah: 18, ayah: 75 }, end: { surah: 20, ayah: 135 } },
  { start: { surah: 21, ayah: 1 }, end: { surah: 22, ayah: 78 } },
  { start: { surah: 23, ayah: 1 }, end: { surah: 25, ayah: 20 } },
  { start: { surah: 25, ayah: 21 }, end: { surah: 27, ayah: 55 } },
  { start: { surah: 27, ayah: 56 }, end: { surah: 29, ayah: 45 } },
  { start: { surah: 29, ayah: 46 }, end: { surah: 33, ayah: 30 } },
  { start: { surah: 33, ayah: 31 }, end: { surah: 36, ayah: 27 } },
  { start: { surah: 36, ayah: 28 }, end: { surah: 39, ayah: 31 } },
  { start: { surah: 39, ayah: 32 }, end: { surah: 41, ayah: 46 } },
  { start: { surah: 41, ayah: 47 }, end: { surah: 45, ayah: 37 } },
  { start: { surah: 46, ayah: 1 }, end: { surah: 51, ayah: 30 } },
  { start: { surah: 51, ayah: 31 }, end: { surah: 57, ayah: 29 } },
  { start: { surah: 58, ayah: 1 }, end: { surah: 66, ayah: 12 } },
  { start: { surah: 67, ayah: 1 }, end: { surah: 77, ayah: 50 } },
  { start: { surah: 78, ayah: 1 }, end: { surah: 114, ayah: 6 } },
];

function getSurahsInJuz(juzNum) {
  const j = JUZ[juzNum - 1];
  const ids = [];
  for (let id = j.start.surah; id <= j.end.surah; id++) ids.push(id);
  return ids;
}

function switchTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  prefs.theme = name;
  localStorage.setItem(KEY_PREFS, JSON.stringify(prefs));
}

function cycleTheme() {
  const themes = ['light', 'sepia', 'dark'];
  const current = prefs.theme || 'dark';
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  switchTheme(next);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = next === 'light' ? '\u2600' : next === 'sepia' ? '\u2615' : '\uD83C\uDF19';
  resetMidnightTimer();
}

function loadTheme() {
  const saved = prefs.theme || 'dark';
  switchTheme(saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = saved === 'light' ? '\u2600' : saved === 'sepia' ? '\u2615' : '\uD83C\uDF19';
}

let midnightTimer = null;
function resetMidnightTimer() {
  if (midnightTimer) { clearTimeout(midnightTimer); midnightTimer = null; }
  deactivateMidnight();
  if (prefs.theme === 'dark') {
    midnightTimer = setTimeout(activateMidnight, 3600000);
  }
}
function activateMidnight() {
  document.documentElement.style.setProperty('--arabic', '#a88a52');
  document.documentElement.style.setProperty('--gold', '#a88a52');
  document.documentElement.setAttribute('data-midnight', 'true');
}
function deactivateMidnight() {
  document.documentElement.style.removeProperty('--arabic');
  document.documentElement.style.removeProperty('--gold');
  document.documentElement.removeAttribute('data-midnight');
}

let focusTapTimer = null;
function handleFocusTap(e) {
  if (e.target.closest('.check-btn') || e.target.closest('.badge') || e.target.closest('.spinner-btn') || e.target.closest('.nav-btn') || e.target.closest('.collapse-bar')) return;
  if (focusTapTimer) {
    clearTimeout(focusTapTimer);
    focusTapTimer = null;
    const html = document.documentElement;
    const isFocus = html.getAttribute('data-focus') === 'true';
    html.setAttribute('data-focus', isFocus ? 'false' : 'true');
  } else {
    focusTapTimer = setTimeout(function () { focusTapTimer = null; }, 350);
  }
}

/* ── anime.js animation helpers ── */
function animateSlideOut(dir, done) {
  if (typeof anime === 'undefined') { done(); return; }
  var card = document.querySelector('#chat.slide-mode .card');
  if (!card) { done(); return; }
  anime({
    targets: card,
    opacity: 0,
    translateX: dir > 0 ? -60 : 60,
    duration: 140,
    easing: 'easeOutCubic',
    complete: done
  });
}

function animateSlideIn(dir) {
  if (typeof anime === 'undefined') return;
  var card = document.querySelector('#chat.slide-mode .card');
  if (!card) return;
  var offset = dir > 0 ? 60 : -60;
  card.style.opacity = '0';
  card.style.transform = 'translateX(' + offset + 'px)';
  anime({
    targets: card,
    opacity: [0, 1],
    translateX: [offset, 0],
    duration: 260,
    easing: 'easeOutCubic'
  });
}

function animatePageOut(dir, done) {
  if (typeof anime === 'undefined') { done(); return; }
  var el = document.querySelector('.page-container');
  if (!el) { done(); return; }
  anime({
    targets: el,
    opacity: 0,
    translateX: dir > 0 ? -40 : 40,
    duration: 140,
    easing: 'easeOutCubic',
    complete: done
  });
}

function animatePageIn(dir) {
  if (typeof anime === 'undefined') return;
  var el = document.querySelector('.page-container');
  if (!el) return;
  var offset = dir > 0 ? 40 : -40;
  el.style.opacity = '0';
  el.style.transform = 'translateX(' + offset + 'px)';
  anime({
    targets: el,
    opacity: [0, 1],
    translateX: [offset, 0],
    duration: 260,
    easing: 'easeOutCubic'
  });
}

function updateProgress() {
  const total = Object.values(state.surahs).reduce(function (sum, s) { return sum + s.versesCount; }, 0);
  const read = getReadCount();
  const pct = total > 0 ? (read / total * 100) : 0;
  document.documentElement.style.setProperty('--progress', pct + '%');
}

function loadFontPrefs() {
  const font = prefs.font || 'amiri';
  applyFont(font);
  const size = prefs.fontSize || 21;
  applyFontSize(size);
}

function toggleCollapse() {
  const hidden = document.documentElement.classList.toggle('controls-hidden');
  prefs.hideControls = hidden;
  localStorage.setItem(KEY_PREFS, JSON.stringify(prefs));
  const btn = document.getElementById('collapseBtn');
  if (btn) btn.classList.toggle('flip', hidden);
}

function getModeIndex(id) {
  return MODE_OPTIONS.findIndex(m => m.id === id);
}

function applyReadingMode(id) {
  prefs.readingMode = id;
  localStorage.setItem(KEY_PREFS, JSON.stringify(prefs));
  const el = document.getElementById('modeValue');
  if (el) {
    const m = MODE_OPTIONS[getModeIndex(id)] || MODE_OPTIONS[0];
    el.textContent = m.name;
  }
  const chat = document.getElementById('chat');
  if (chat) {
    chat.classList.remove('slide-mode', 'page-mode');
    chat.classList.add(id + '-mode');
  }
  if (state.verses.length > 0) {
    if (id === 'page') { state.pageIndex = 0; renderPage(); }
    else { renderVerses(); }
    updateUI();
  }
}

function cycleReadingMode(dir) {
  const cur = prefs.readingMode || 'slide';
  const idx = getModeIndex(cur);
  const next = (idx + dir + MODE_OPTIONS.length) % MODE_OPTIONS.length;
  applyReadingMode(MODE_OPTIONS[next].id);
}

function getFontIndex(id) {
  return FONT_OPTIONS.findIndex(f => f.id === id);
}

function applyFont(id) {
  const idx = getFontIndex(id);
  const f = FONT_OPTIONS[idx >= 0 ? idx : 0];
  document.documentElement.style.setProperty('--font-arabic', f.family);
  prefs.font = f.id;
  localStorage.setItem(KEY_PREFS, JSON.stringify(prefs));
  const el = document.getElementById('fontValue');
  if (el) el.textContent = f.name;
}

function fontCycle(dir) {
  const cur = prefs.font || 'amiri';
  const idx = getFontIndex(cur);
  const next = (idx + dir + FONT_OPTIONS.length) % FONT_OPTIONS.length;
  applyFont(FONT_OPTIONS[next].id);
}

function applyFontSize(px) {
  const clamped = Math.max(14, Math.min(40, px));
  document.documentElement.style.setProperty('--font-size-arabic', clamped + 'px');
  prefs.fontSize = clamped;
  localStorage.setItem(KEY_PREFS, JSON.stringify(prefs));
  const el = document.getElementById('sizeValue');
  if (el) el.textContent = String(clamped);
  const mode = prefs.readingMode || 'slide';
  if (mode === 'page' && state.verses.length > 0) {
    renderPage();
    updateUI();
  }
}

function sizeChange(delta) {
  const cur = prefs.fontSize || 21;
  let next = cur + delta;
  const rounded = FONT_SIZES.reduce((a, b) => Math.abs(b - next) < Math.abs(a - next) ? b : a);
  applyFontSize(rounded);
}

if (prefs.readingMode === 'scroll') {
  prefs.readingMode = 'slide';
  localStorage.setItem(KEY_PREFS, JSON.stringify(prefs));
}

const state = {
  currentSurah: 1,
  fromAyah: 1,
  toAyah: 7,
  lang: 'ms',
  verses: [],
  tafsirVerses: [],
  tafsirFailed: false,
  surahList: [],
  surahs: {},
  readLog: {},
  tab: 'read',
  slideIndex: 0,
  pageIndex: 0,
};

const $ = id => document.getElementById(id);

const IS_DEXIE = typeof Dexie !== 'undefined';

async function initDexie() {
  if (!IS_DEXIE) return;
  try {
    window.quranDB = new Dexie('QuranFlashDB');
    quranDB.version(1).stores({ readLog: 'key' });
    await quranDB.open();
    var legacy = localStorage.getItem(KEY_READ_LOG);
    if (legacy) {
      var data = JSON.parse(legacy);
      var keys = Object.keys(data);
      if (keys.length > 0) {
        var count = await quranDB.readLog.count();
        if (count === 0) {
          await quranDB.readLog.bulkPut(keys.map(function (k) {
            return { key: k, timestamp: today() };
          }));
        }
      }
      localStorage.removeItem(KEY_READ_LOG);
    }
    var entries = await quranDB.readLog.toArray();
    if (entries.length > 0) {
      state.readLog = {};
      for (var i = 0; i < entries.length; i++) {
        state.readLog[entries[i].key] = entries[i].timestamp || today();
      }
    }
    /* [DB] Dexie sedia */
  } catch (e) {
    console.warn('[DB] Dexie gagal, guna localStorage:', e.message);
  }
}

function loadReadLog() {
  if (Object.keys(state.readLog).length > 0) return;
  var raw = localStorage.getItem(KEY_READ_LOG);
  if (raw) {
    state.readLog = JSON.parse(raw);
  }
}

function saveReadLog() {
  localStorage.setItem(KEY_READ_LOG, JSON.stringify(state.readLog));
  if (window.quranDB) {
    var keys = Object.keys(state.readLog);
    if (keys.length > 0) {
      quranDB.readLog.bulkPut(keys.map(function (k) {
        return { key: k, timestamp: state.readLog[k] || today() };
      })).catch(function (err) {
        console.warn('[DB] bulkPut gagal:', err.message);
      });
    }
  }
}

function isAyahRead(surah, ayah) {
  return !!state.readLog[`${surah}:${ayah}`];
}

function markAyahRead(surah, ayah) {
  if (!state.readLog[`${surah}:${ayah}`]) {
    state.readLog[`${surah}:${ayah}`] = today();
  }
  saveReadLog();
  const mode = prefs.readingMode || 'slide';
  if (mode === 'page') {
    const line = document.querySelector('.page-line[data-key="' + surah + ':' + ayah + '"]');
    if (line) line.style.opacity = '0.4';
  } else {
    const card = document.querySelector('[data-key="' + surah + ':' + ayah + '"]');
    if (card) { card.classList.add('card-read'); const cb = card.querySelector('.check-btn'); if (cb) { cb.textContent = '\u2713'; cb.classList.add('checked'); } }
  }
  updateUI();
  updateProgress();
}

function markRangeRead(surah, from, to) {
  var ts = today();
  for (let a = from; a <= to; a++) {
    if (!state.readLog[`${surah}:${a}`]) {
      state.readLog[`${surah}:${a}`] = ts;
    }
  }
  saveReadLog();
  const mode = prefs.readingMode || 'slide';
  if (mode === 'page') {
    for (let a = from; a <= to; a++) {
      const line = document.querySelector('.page-line[data-key="' + surah + ':' + a + '"]');
      if (line) line.style.opacity = '0.4';
    }
  } else {
    for (let a = from; a <= to; a++) {
      const card = document.querySelector('[data-key="' + surah + ':' + a + '"]');
      if (card) { card.classList.add('card-read'); const cb = card.querySelector('.check-btn'); if (cb) { cb.textContent = '\u2713'; cb.classList.add('checked'); } }
    }
  }
  updateUI();
  updateProgress();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function getReadHistory() {
  const entries = [];
  for (const [key] of Object.entries(state.readLog)) {
    const [surah, ayah] = key.split(':').map(Number);
    entries.push({ surah, ayah, key });
  }
  entries.sort((a, b) => {
    if (a.surah !== b.surah) return a.surah - b.surah;
    return a.ayah - b.ayah;
  });
  return entries;
}

function getReadCount() {
  return Object.keys(state.readLog).length;
}

function getUniqueSurahsRead() {
  const set = new Set();
  for (const key of Object.keys(state.readLog)) {
    set.add(key.split(':')[0]);
  }
  return set.size;
}

function getReadDays() {
  var days = {};
  var now = today();
  for (var key in state.readLog) {
    var val = state.readLog[key];
    var date = typeof val === 'string' ? val.slice(0, 10) : now;
    days[date] = true;
  }
  return Math.max(1, Object.keys(days).length);
}

function getTopSurahs() {
  const counts = {};
  for (const key of Object.keys(state.readLog)) {
    const surah = key.split(':')[0];
    counts[surah] = (counts[surah] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

function updateUI() {
  const mode = prefs.readingMode || 'slide';
  const s = state.surahs[state.currentSurah];
  const name = s ? s.nameAr + ' (' + s.name + ')' : 'Surah ' + state.currentSurah;
  const maxAyat = s?.versesCount || Infinity;
  $('surahName').textContent = name;
  if (mode === 'page') {
    $('ayahInfo').textContent = 'Halaman ' + (state.pageIndex + 1);
  } else {
    $('ayahInfo').textContent = 'Ayat ' + state.fromAyah + '-' + Math.min(state.toAyah, maxAyat);
  }
  $('revelation').textContent = s ? s.revelation : '';
  $('ayahFrom').value = state.fromAyah;
  $('ayahTo').value = state.toAyah;
  $('langSelect').value = state.lang;
  $('readCount').textContent = getReadCount();
  const fontEl = $('fontValue');
  if (fontEl) {
    const cur = prefs.font || 'amiri';
    const f = FONT_OPTIONS[getFontIndex(cur)] || FONT_OPTIONS[0];
    fontEl.textContent = f.name;
  }
  const sizeEl = $('sizeValue');
  if (sizeEl) sizeEl.textContent = String(prefs.fontSize || 21);
  const modeEl = $('modeValue');
  if (modeEl) {
    const m = MODE_OPTIONS[getModeIndex(mode)] || MODE_OPTIONS[0];
    modeEl.textContent = m.name;
  }
}

function loadSurahList() {
  if (typeof QURAN_DATA === 'undefined' || !QURAN_DATA.list) {
    console.error('QURAN_DATA not loaded — pastikan data.js dimuat');
    return false;
  }
  state.surahList = QURAN_DATA.list;
  state.surahs = {};
  for (const s of state.surahList) {
    state.surahs[s.id] = s;
  }
  return true;
}

function isTafsirMode() {
  return state.lang in TAFSIR_EDITIONS;
}

async function loadVerses() {
  state.verses = [];
  state.tafsirVerses = [];
  state.tafsirFailed = false;
  state.slideIndex = 0;
  state.pageIndex = 0;
  $('selesaiBtn').disabled = true;

  const data = QURAN_DATA?.v?.[state.currentSurah];
  if (!data || data.length === 0) {
    $('chat').innerHTML = `<div class="empty"><span>\u26A0</span><p>Data surah ${state.currentSurah} tidak tersedia.</p></div>`;
    return;
  }
  state.verses = data;

    var spinner = $('loadingSpinner');
    if (isTafsirMode()) {
      if (spinner) spinner.style.display = 'flex';
      try {
        const idStr = String(state.currentSurah).padStart(3, '0');
        const res = await fetch(`data-tafsir/${TAFSIR_EDITIONS[state.lang]}/${idStr}.json`);
        if (res.ok) state.tafsirVerses = await res.json();
        else throw new Error('HTTP ' + res.status);
      } catch (e) {
        state.tafsirFailed = true;
        if (spinner) {
          var msg = spinner.querySelector('span');
          if (msg) msg.textContent = 'Tafsir luar talian — guna terjemahan biasa';
          setTimeout(function () { if (spinner) spinner.style.display = 'none'; }, 1500);
        }
      }
      if (spinner) spinner.style.display = 'none';
    }

    if (spinner) spinner.style.display = 'none';

  $('selesaiBtn').disabled = false;
  const mode = prefs.readingMode || 'slide';
  if (mode === 'page') { renderPage(); }
  else { renderVerses(); }
  updateUI();
}

function makeCardHtml(v, ayahNum) {
  const key = `${state.currentSurah}:${ayahNum}`;
  const read = isAyahRead(state.currentSurah, ayahNum);
  const i = ayahNum - 1;
  const translation = state.lang === 'none' ? '' :
    (state.lang === 'en' ? v.translationEn :
     isTafsirMode() ? (state.tafsirVerses[i]?.tafsir || '') :
     v.translationMs);
  return {
    key,
    read,
    html: `
      <div class="card-meta">
        <span class="badge">${state.currentSurah}:${ayahNum}</span>
        <span class="check-btn${read ? ' checked' : ''}" data-key="${key}">${read ? '\u2713' : '\u25CB'}</span>
      </div>
      <div class="arabic" lang="ar" dir="rtl">${v.arabic}</div>
      ${translation ? `<div class="translation">${translation}</div>` : ''}
    `
  };
}

function renderVerses() {
  const chat = $('chat');
  chat.innerHTML = '';
  const mode = prefs.readingMode || 'slide';
  if (mode === 'page' && state.verses.length > 0) {
    renderPage();
    return;
  }
  if (state.verses.length === 0) {
    chat.innerHTML = '<div class="empty"><span>\uD83D\uDCD6</span><p>Pilih surah untuk mula membaca.</p></div>';
    return;
  }
  const from = state.fromAyah;
  const to = state.toAyah;
  const s = state.surahs[state.currentSurah];
  const maxAyat = s?.versesCount || Infinity;
  const actualTo = Math.min(to, maxAyat);

  if (mode === 'slide') {
    const idx = Math.min(state.slideIndex, actualTo - from);
    const i = from - 1 + idx;
    if (i < 0 || i >= state.verses.length) { state.slideIndex = 0; }
    const vi = from - 1 + state.slideIndex;
    const v = state.verses[vi];
    if (!v && state.verses.length > 0) { state.slideIndex = 0; renderVerses(); return; }
    if (!v) { chat.innerHTML = '<div class="empty"><span>\u26A0</span><p>Tiada data ayat.</p></div>'; return; }
    const { html } = makeCardHtml(v, v.ayah);
    const card = document.createElement('div');
    card.className = 'card' + (isAyahRead(state.currentSurah, v.ayah) ? ' card-read' : '');
    card.dataset.key = `${state.currentSurah}:${v.ayah}`;
    card.dataset.surah = state.currentSurah;
    card.dataset.ayah = v.ayah;
    card.innerHTML = html;
    chat.appendChild(card);
    const total = actualTo - from + 1;
    const hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.textContent = `${state.currentSurah}:${v.ayah} (${state.slideIndex + 1}/${total})`;
    chat.appendChild(hint);
    return;
  }

  for (let i = from - 1; i < actualTo && i < state.verses.length; i++) {
    const v = state.verses[i];
    const { html } = makeCardHtml(v, v.ayah);
    const card = document.createElement('div');
    card.className = 'card' + (isAyahRead(state.currentSurah, v.ayah) ? ' card-read' : '');
    card.dataset.key = `${state.currentSurah}:${v.ayah}`;
    card.dataset.surah = state.currentSurah;
    card.dataset.ayah = v.ayah;
    card.innerHTML = html;
    chat.appendChild(card);
  }
  chat.scrollTop = 0;
}

/* Touch/swipe for slide mode */
let touchStartX = 0;
let touchStartY = 0;
function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}
function handleTouchEnd(e) {
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(dy)) return;
  const mode = prefs.readingMode || 'slide';
  if (mode === 'slide') {
    if (dx < 0) slideNav(1); else slideNav(-1);
  } else if (mode === 'page') {
    if (dx < 0) pageNav(1); else pageNav(-1);
  }
}

function switchTab(tab) {
  $('readTab').style.display = tab === 'read' ? 'flex' : 'none';
  $('historyTab').style.display = tab === 'history' ? 'block' : 'none';
  $('statsTab').style.display = tab === 'stats' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  state.tab = tab;
  if (tab === 'history') renderHistory();
  if (tab === 'stats') renderStats();
}

function renderHistory() {
  const panel = $('historyPanel');
  const entries = getReadHistory();
  if (entries.length === 0) {
    panel.innerHTML = '<div class="empty"><span>\uD83D\uDCED</span><p>Belum ada sejarah bacaan.</p></div>';
    return;
  }
  const grouped = {};
  for (const e of entries) {
    const label = `${e.surah}:${e.ayah}`;
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(e);
  }
  let html = '';
  const labels = Object.keys(grouped).sort((a, b) => {
    const [sa, aa] = a.split(':').map(Number);
    const [sb, ab] = b.split(':').map(Number);
    return sa !== sb ? sa - sb : aa - ab;
  }).reverse();
  for (const label of labels.slice(0, 200)) {
    const [surahId, ayahNum] = label.split(':').map(Number);
    const name = state.surahs[surahId]?.name || `Surah ${surahId}`;
    html += `<div class="hist-item">
      <span class="hist-badge">${surahId}:${ayahNum}</span>
      <span class="hist-name">${name}</span>
    </div>`;
  }
  panel.innerHTML = html;
}

function renderStats() {
  const panel = $('statsPanel');
  const totalAyat = getReadCount();
  const uniqueSurahs = getUniqueSurahsRead();
  const totalDays = getReadDays();
  const topSurah = getTopSurahs();
  let html = `<div class="stats-grid">
    <div class="stat-card"><span class="stat-num">${totalAyat}</span><span class="stat-label">Ayat dibaca</span></div>
    <div class="stat-card"><span class="stat-num">${uniqueSurahs}</span><span class="stat-label">Surah</span></div>
    <div class="stat-card"><span class="stat-num">${totalDays}</span><span class="stat-label">Hari</span></div>
  </div>`;
  if (topSurah.length > 0) {
    html += '<div class="stat-list"><h4>Top Surah:</h4>';
    for (const [s, c] of topSurah) {
      const name = state.surahs[parseInt(s)]?.name || `Surah ${s}`;
      html += `<div class="stat-row"><span>${name}</span><span>${c} ayat</span></div>`;
    }
    html += '</div>';
  }
  panel.innerHTML = html;
}

function handleChatClick(e) {
  const btn = e.target.closest('.check-btn');
  if (btn) {
    const key = btn.dataset.key;
    const [surah, ayah] = key.split(':').map(Number);
    if (!isAyahRead(surah, ayah)) {
      markAyahRead(surah, ayah);
      showToast('\u2713 ' + key, 'ok');
    }
  }
}

function handleSelesai() {
  if ($('selesaiBtn').disabled) return;
  const mode = prefs.readingMode || 'slide';
  if (mode === 'page') {
    const pages = state._pages;
    const page = pages ? pages[state.pageIndex] : null;
    if (!page) return;
    let total = 0;
    for (const v of page.verses) {
      const key = state.currentSurah + ':' + v.ayah;
      if (!state.readLog[key]) { state.readLog[key] = true; total++; }
    }
    saveReadLog();
    $('selesaiBtn').disabled = true;
    showToast('\u2713 ' + total + ' ayat direkodkan', 'ok');
    renderPage();
    updateProgress();
    setTimeout(function () { $('selesaiBtn').disabled = false; }, 300);
    return;
  }
  const s = state.surahs[state.currentSurah];
  const maxAyat = s?.versesCount || Infinity;
  const to = Math.min(state.toAyah, maxAyat);
  markRangeRead(state.currentSurah, state.fromAyah, to);
  const count = to - state.fromAyah + 1;
  $('selesaiBtn').disabled = true;
  showToast('\u2713 ' + count + ' ayat direkodkan', 'ok');
  setTimeout(function () { $('selesaiBtn').disabled = false; }, 300);
}

  function showToast(msg, type) {
    const el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast ' + (type || '');
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function showToastError(msg) {
    showToast('\u26A0 ' + msg, 'error');
  }

/* ✦ JUZ & SURAH SELECTOR */

function showSurahSelector() {
  const overlay = $('surahSelector');
  if (overlay) overlay.style.display = 'flex';
  const nav = $('quran-nav');
  if (nav) nav.style.display = 'flex';
  renderSurahSelector();
}

function hideSurahSelector() {
  const overlay = $('surahSelector');
  if (overlay) overlay.style.display = 'none';
  const nav = $('quran-nav');
  if (nav) nav.style.display = 'none';
}

function renderSurahSelector() {
  const list = $('surahList');
  if (!list) return;
  renderJuzBar();
  renderSurahList(state.selectorJuz || 1);
}

function renderJuzBar() {
  const bar = $('juzBar');
  if (!bar) return;
  const selected = state.selectorJuz || 1;
  bar.innerHTML = '';
  for (let i = 1; i <= 30; i++) {
    const btn = document.createElement('button');
    btn.className = 'juz-btn' + (i === selected ? ' active' : '');
    btn.textContent = i;
    btn.dataset.juz = i;
    btn.addEventListener('click', function () {
      state.selectorJuz = i;
      renderJuzBar();
      renderSurahList(i);
    });
    bar.appendChild(btn);
  }
}

function renderSurahList(juzNum) {
  const list = $('surahList');
  if (!list) return;
  const ids = getSurahsInJuz(juzNum);
  list.innerHTML = '';
  for (const id of ids) {
    const s = state.surahs[id];
    if (!s) continue;
    const item = document.createElement('div');
    item.className = 'surah-item';
    item.innerHTML =
      '<span class="surah-num">' + id + '</span>' +
      '<span class="surah-info">' +
      '<span class="surah-ar">' + s.nameAr + '</span>' +
      '<span class="surah-en">' + s.name + ' (' + s.versesCount + ' ayat\u00B7' + s.revelation + ')</span>' +
      '</span>';
    item.addEventListener('click', function () {
      selectSurah(id);
    });
    list.appendChild(item);
  }
}

function selectSurah(id) {
  state.currentSurah = id;
  const s = state.surahs[id];
  state.fromAyah = 1;
  state.toAyah = Math.min(7, s?.versesCount || 7);
  hideSurahSelector();
  const cm = prefs.readingMode || 'slide';
  const chat = $('chat');
  if (chat) {
    chat.classList.remove('slide-mode', 'page-mode');
    chat.classList.add(cm + '-mode');
  }
  loadVerses();
}

function showSurahPicker() {
  const juz = findJuzForSurah(state.currentSurah);
  state.selectorJuz = juz;
  showSurahSelector();
}

function findJuzForSurah(surahId) {
  for (let i = 0; i < JUZ.length; i++) {
    const j = JUZ[i];
    if (surahId >= j.start.surah && surahId <= j.end.surah) {
      return i + 1;
    }
  }
  return 1;
}

/* Page mode */
const CHARS_PER_LINE = 38;

function toArabicNum(n) {
  const digits = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
  return String(n).replace(/\d/g, function (d) { return digits[parseInt(d)]; });
}

function estimateLines(text) {
  const fontSize = prefs.fontSize || 21;
  const cpl = Math.round(CHARS_PER_LINE * 21 / fontSize);
  return Math.max(1, Math.ceil(text.length / cpl));
}

function getMaxPageLines() {
  const chat = document.getElementById('chat');
  const h = chat ? chat.clientHeight : 600;
  if (h < 250) return 6;
  const fontSize = prefs.fontSize || 21;
  const linePx = Math.round(fontSize * 2.1);
  const headerPx = Math.round(fontSize * 1.9 * 2 + 36);
  const footerPx = 30;
  const avail = h - headerPx - footerPx - 32;
  return Math.max(3, Math.floor(avail / linePx));
}

function renderPage() {
  const chat = document.getElementById('chat');
  chat.innerHTML = '';
  chat.classList.remove('slide-mode');
  chat.classList.add('page-mode');

  const verses = state.verses;
  if (!verses || verses.length === 0) {
    chat.innerHTML = '<div class="empty"><span>\uD83D\uDCD6</span><p>Tiada ayat.</p></div>';
    return;
  }

  const MAX_LINES = getMaxPageLines();
  const pages = [];
  let curLines = 2;
  let curVerses = [];

  for (const v of verses) {
    const est = estimateLines(v.arabic);
    if (curVerses.length > 0 && curLines + est > MAX_LINES) {
      pages.push({ verses: curVerses, lines: curLines });
      curVerses = [v];
      curLines = est;
    } else {
      curVerses.push(v);
      curLines += est;
    }
  }
  if (curVerses.length) pages.push({ verses: curVerses, lines: curLines });

  if (state.pageIndex >= pages.length) state.pageIndex = pages.length - 1;
  if (state.pageIndex < 0) state.pageIndex = 0;
  state._pages = pages;

  const page = pages[state.pageIndex];
  const s = state.surahs[state.currentSurah];
  const container = document.createElement('div');
  container.className = 'page-container';

  const pageDiv = document.createElement('div');
  pageDiv.className = 'page';

  if (page.verses[0] === verses[0]) {
    const header = document.createElement('div');
    header.className = 'page-header';
    header.innerHTML =
      '<span class="page-surah-name" lang="ar" dir="rtl">' + (s ? s.nameAr : '') + '</span>' +
      '<span class="page-revelation">' + (s ? s.revelation + ' \u00B7 ' + toArabicNum(s.versesCount) + ' \u0622\u064A\u0629' : '') + '</span>';
    pageDiv.appendChild(header);

    const basmalah = document.createElement('div');
    basmalah.className = 'page-basmalah';
    basmalah.setAttribute('lang', 'ar');
    basmalah.setAttribute('dir', 'rtl');
    basmalah.textContent = '\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u064E\u0651\u0647\u0650 \u0671\u0644\u0631\u064E\u0651\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0671\u0644\u0631\u064E\u0651\u062D\u0650\u064A\u0645\u0650';
    pageDiv.appendChild(basmalah);
  }

  for (const v of page.verses) {
    const line = document.createElement('div');
    line.className = 'page-line';
    line.dataset.key = state.currentSurah + ':' + v.ayah;
    if (isAyahRead(state.currentSurah, v.ayah)) line.style.opacity = '0.4';
    line.innerHTML =
      '<span class="page-ayah-text" lang="ar" dir="rtl">' + v.arabic + '</span>' +
      '<span class="page-ayah-num">' + toArabicNum(v.ayah) + '</span>';
    pageDiv.appendChild(line);
  }

  container.appendChild(pageDiv);

  const footer = document.createElement('div');
  footer.className = 'page-footer';
  footer.textContent = (state.pageIndex + 1) + ' / ' + pages.length;
  container.appendChild(footer);

  chat.appendChild(container);
}

function pageNav(dir) {
  const pages = state._pages;
  if (!pages || pages.length === 0) return;
  const next = state.pageIndex + dir;
  if (next < 0 || next >= pages.length) {
    if (dir < 0) document.getElementById('prevBtn').click();
    else document.getElementById('nextBtn').click();
    return;
  }
  animatePageOut(dir, function () {
    state.pageIndex = next;
    renderPage();
    updateUI();
    animatePageIn(dir);
  });
}

function slideNav(dir) {
  const from = state.fromAyah;
  const to = state.toAyah;
  const s = state.surahs[state.currentSurah];
  const maxAyat = s?.versesCount || Infinity;
  const actualTo = Math.min(to, maxAyat);
  const total = actualTo - from + 1;
  let next = state.slideIndex + dir;
  if (next < 0 || next >= total) {
    if (dir < 0) {
      document.getElementById('prevBtn').click();
    } else {
      document.getElementById('nextBtn').click();
    }
    state.slideIndex = 0;
    return;
  }
  animateSlideOut(dir, function () {
    state.slideIndex = next;
    renderVerses();
    animateSlideIn(dir);
  });
}

const TAFSIR_EDITIONS = { 'tafsir-muyassar': 'muyassar', 'tafsir-jalalayn': 'jalalayn', 'tafsir-ar-ibn-kathir': 'ar-ibn-kathir', 'tafsir-en-ibn-kathir': 'en-ibn-kathir' };

const FONT_OPTIONS = [
  { id: 'amiri', name: 'Amiri', family: "'Amiri','Traditional Arabic','Scheherazade New','Noto Naskh Arabic',serif" },
  { id: 'scheherazade-new', name: 'Scheherazade New', family: "'Scheherazade New','Traditional Arabic','Noto Naskh Arabic',serif" },
  { id: 'uthman-naskh', name: 'Uthman Naskh', family: "'Uthman Naskh','Traditional Arabic','Scheherazade New',serif" },
];

const FONT_SIZES = [14, 16, 18, 20, 21, 22, 24, 26, 28, 30, 32, 36, 40];

const MODE_OPTIONS = [
  { id: 'slide', name: 'Slide' },
  { id: 'page', name: 'Muka Surat' },
];

/* Bind inputs */
function bindInputs() {
  $('surahBtn').addEventListener('click', showSurahPicker);
  const closeBtn = $('selectorClose');
  if (closeBtn) closeBtn.addEventListener('click', hideSurahSelector);

  $('ayahFrom').addEventListener('change', () => {
    const s = state.surahs[state.currentSurah];
    state.fromAyah = Math.max(1, parseInt($('ayahFrom').value) || 1);
    if (s) state.fromAyah = Math.min(state.fromAyah, s.versesCount);
    if (state.fromAyah > state.toAyah) state.toAyah = state.fromAyah;
    loadVerses();
  });

  $('ayahTo').addEventListener('change', () => {
    const s = state.surahs[state.currentSurah];
    state.toAyah = Math.max(state.fromAyah, parseInt($('ayahTo').value) || state.fromAyah);
    if (s) state.toAyah = Math.min(state.toAyah, s.versesCount);
    loadVerses();
  });

  $('langSelect').addEventListener('change', () => {
    const oldLang = state.lang;
    state.lang = $('langSelect').value;
    if (isTafsirMode() || oldLang in TAFSIR_EDITIONS) {
      loadVerses();
    } else {
      renderVerses();
    }
  });

  $('prevBtn').addEventListener('click', () => {
    const mode = prefs.readingMode || 'slide';
    if (mode === 'page') {
      if (state.pageIndex > 0) { state.pageIndex--; renderPage(); updateUI(); }
      return;
    }
    const chunk = state.toAyah - state.fromAyah + 1;
    if (state.fromAyah > 1) {
      state.fromAyah = Math.max(1, state.fromAyah - chunk);
      const maxAyat = state.surahs[state.currentSurah]?.versesCount || state.toAyah;
      state.toAyah = Math.min(state.fromAyah + chunk - 1, maxAyat);
    } else if (state.currentSurah > 1) {
      state.currentSurah--;
      state.fromAyah = 1;
      state.toAyah = Math.min(7, state.surahs[state.currentSurah]?.versesCount || 7);
    }
    loadVerses();
  });

  $('nextBtn').addEventListener('click', () => {
    const mode = prefs.readingMode || 'slide';
    if (mode === 'page') {
      const pages = state._pages;
      if (pages && state.pageIndex < pages.length - 1) { state.pageIndex++; renderPage(); updateUI(); }
      return;
    }
    const s = state.surahs[state.currentSurah];
    const maxAyat = s?.versesCount || 7;
    const chunk = state.toAyah - state.fromAyah + 1;
    if (state.toAyah < maxAyat) {
      state.fromAyah = Math.min(state.toAyah + 1, maxAyat);
      state.toAyah = Math.min(state.fromAyah + chunk - 1, maxAyat);
    } else if (state.currentSurah < 114) {
      state.currentSurah++;
      state.fromAyah = 1;
      state.toAyah = Math.min(7, state.surahs[state.currentSurah]?.versesCount || 7);
    }
    loadVerses();
  });

  $('clearHistory').addEventListener('click', () => {
    if (confirm('Padam semua sejarah bacaan?')) {
      state.readLog = {};
      localStorage.removeItem(KEY_READ_LOG);
      if (window.quranDB) {
        window.quranDB.readLog.clear().catch(function (err) {
          console.warn('[DB] clear gagal:', err.message);
        });
      }
      $('readCount').textContent = '0';
      renderHistory();
      showToast('Sejarah dipadam', 'ok');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    const mode = prefs.readingMode || 'slide';
    if (e.key === 'ArrowLeft') {
      if (mode === 'slide') { slideNav(-1); }
      else if (mode === 'page') { pageNav(-1); }
      else { $('prevBtn').click(); }
    }
    if (e.key === 'ArrowRight') {
      if (mode === 'slide') { slideNav(1); }
      else if (mode === 'page') { pageNav(1); }
      else { $('nextBtn').click(); }
    }
    if (e.key === ' ') { e.preventDefault(); handleSelesai(); }
  });

  document.getElementById('chat').addEventListener('click', handleChatClick);
  document.getElementById('chat').addEventListener('click', handleFocusTap);
  document.getElementById('chat').addEventListener('touchstart', handleTouchStart, { passive: true });
  document.getElementById('chat').addEventListener('touchend', handleTouchEnd, { passive: true });

  const collapseBtn = document.getElementById('collapseBtn');
  const collapseBar = document.getElementById('collapseBar');
  if (collapseBtn) collapseBtn.addEventListener('click', toggleCollapse);
  if (collapseBar) collapseBar.addEventListener('click', (e) => { if (e.target === collapseBar) toggleCollapse(); });

  const fontPrev = document.getElementById('fontPrev');
  const fontNext = document.getElementById('fontNext');
  if (fontPrev) fontPrev.addEventListener('click', () => fontCycle(-1));
  if (fontNext) fontNext.addEventListener('click', () => fontCycle(1));

  const sizeDown = document.getElementById('sizeDown');
  const sizeUp = document.getElementById('sizeUp');
  if (sizeDown) sizeDown.addEventListener('click', () => sizeChange(-2));
  if (sizeUp) sizeUp.addEventListener('click', () => sizeChange(2));

  const modePrev = document.getElementById('modePrev');
  const modeNext = document.getElementById('modeNext');
  if (modePrev) modePrev.addEventListener('click', () => cycleReadingMode(-1));
  if (modeNext) modeNext.addEventListener('click', () => cycleReadingMode(1));
}

function updateOfflineIndicator() {
  var el = $('offlineIndicator');
  if (!el) return;
  if (!navigator.onLine) {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

async function init() {
  $('selesaiBtn').addEventListener('click', handleSelesai);
  await initDexie();
  loadReadLog();
  updateUI();
  updateProgress();
  updateOfflineIndicator();
  window.addEventListener('online', updateOfflineIndicator);
  window.addEventListener('offline', updateOfflineIndicator);

  document.querySelectorAll('.tab-btn').forEach(b => {
    b.addEventListener('click', () => switchTab(b.dataset.tab));
  });

  const ok = loadSurahList();
  if (!ok) {
    $('surahName').textContent = '\u26A0 Data tidak tersedia';
    $('chat').innerHTML = '<div class="empty"><span>\u26A0</span><p>Gagal memuat data surah.<br><small>Pastikan data/surah_list.json wujud.</small></p></div>';
    return;
  }

  loadTheme();
  loadFontPrefs();
  resetMidnightTimer();
  updateProgress();
  if (prefs.hideControls) {
    document.documentElement.classList.add('controls-hidden');
    const btn = document.getElementById('collapseBtn');
    if (btn) btn.classList.add('flip');
  }

  const firstJuz = findJuzForSurah(state.currentSurah);
  state.selectorJuz = firstJuz;

  const initMode = prefs.readingMode || 'slide';
  const chatEl = $('chat');
  if (chatEl) chatEl.classList.add(initMode + '-mode');

  bindInputs();
  updateUI();
  showSurahSelector();

  const toggleEl = document.getElementById('themeToggle');
  if (toggleEl) toggleEl.addEventListener('click', cycleTheme);
}

document.addEventListener('DOMContentLoaded', init);
