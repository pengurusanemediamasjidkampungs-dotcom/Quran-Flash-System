# Changelog

## 3.0.0 (2026-05-31) — Responsive Auto-Adapt System

### Added
- **`shared-responsive.css`**: CSS responsive terpusat untuk semua sub-sistem. 6 breakpoints (360px–1280px), orientation queries, container queries, fluid typography, safe area insets, dynamic viewport units, accessibility (prefers-reduced-motion, prefers-contrast), print styles.
- **`shared-responsive.js`**: Viewport height fix (iOS Safari 100vh bug via `--vh` custom property), orientation watcher (`data-orientation` attribute), screen size classifier (`data-screen` attribute).
- **Sistem responsive 7 sub-sistem**: Dashboard (Hub), Quran Reader, Doa & Zikir, Kewangan, Menu, Vault, Admin — semuanya dipaut ke shared-responsive.
- **Orientation-aware layout**: Landscape pada skrin kecil (≤520px tinggi) — header mampat, ruang maksima untuk kandungan. Landscape pada tablet — sidebar / layout luas.
- **`interactive-widget=resizes-content`** pada viewport meta — keyboard mobile tak timpa kandungan.
- **Fluid container**: `min(480px, 100vw - 1rem)` gantikan `max-width: 480px` tetap.
- **Sidebar mini-bar**: Sistem Doa sidebar jadi 56px dalam landskap (icon sahaja).
- **Ayat Hari Ini**: Range diperluas surah 87–114 (Al-A'la hingga An-Nas), tracking localStorage untuk elak ayat ulang dalam sehari.
- **Ayat random fallback**: Reset seen list bila semua ayat sudah dilihat, kitaran baru bermula.

### Changed
- **quran.html**: `user-scalable=no` dibuang → diganti `viewport-fit=cover`.
- **style.css**: Breakpoints diperluas (360px, 480px, 640px, 1024px + orientation landscape).
- **index.html (Hub)**: Waktu solat grid responsif ikut orientasi & saiz skrin.
- **sistem-doa/style.css**: Sidebar responsive — landscape mini, tablet portrait content padding luas.
- **sistem-kewangan**: Dari 0 media query → 4 breakpoints + orientation.
- **sistem-menu**: Dari 0 media query → 4 breakpoints + orientation.
- **sistem-vault**: Dari 0 media query → 3 breakpoints + orientation.
- **admin/css/admin.css**: Ditambah orientation landscape dan width breakpoints.

### Fixed
- iOS Safari `100vh` bug — dynamic `--vh` property
- Notched device padding — `env(safe-area-inset-*)` merentas semua sub-sistem
- Ayat harian range: 93–114 → 87–114

## 2.1.0 (2026-05-29) — Multi-Modul Hub

### Added
- **Launcher hub** (`index.html`): Portal utama dengan grid 4 modul — Quran, Waktu Solat, Doa, Zikir. Navigasi antara modul melalui pautan terus.
- **Quran module** (`quran.html`): Dipindah dari `index.html` asal ke fail berasingan. Ditambah butang "← Hub" untuk kembali ke portal.
- **Doa placeholder** (`doa.html`): Rangka halaman doa harian — sedia untuk diisi kandungan.
- **Zikir placeholder** (`zikir.html`): Rangka halaman zikir & tasbih — sedia untuk diisi kandungan.
- **`.back-link`** style dalam `style.css`: Pautan kembali ke hub dari mana-mana modul.

### Changed
- **Service Worker** (`sw.js`): `quran.html` ditambah ke `SHELL_URLS` — diprecache bersama shell.

## 2.0.0 (2026-05-29) — Premium PWA Upgrade

### Added
- **Dexie.js (IndexedDB):** Persistent readLog storage with timestamps. Auto-migration from legacy localStorage. Fallback to localStorage if Dexie unavailable.
- **anime.js (17KB):** Smooth slide-out/slide-in transitions for Slide mode cards and Page mode flips. 260ms easeOutCubic animation.
- **Offline indicator:** Red bar "Luar Talian" appears when `navigator.onLine` is false.
- **Loading spinner:** Animated gold spinner shows during tafsir fetch. Shows "Tafsir luar talian — guna terjemahan biasa" on failure.
- **SW update notification:** Toast "Kemas kini tersedia. Tutup & buka semula." when new SW is installed.
- **Uthman Naskh font option:** Available as 3rd Arabic font choice alongside Amiri and Scheherazade New.
- **`assets/anime.min.js`** and **`assets/dexie.min.js`** — both precached by Service Worker for true offline-first.

### Changed
- **Service Worker:** Dual-cache architecture — `quran-shell-v5` (CacheFirst) for app shell, `quran-data-v5` (NetworkFirst) for tafsir JSONs. Removed `sw.js` from precache list.
- **`data.js` loading:** Changed to `<script defer>` — downloads in parallel with HTML parse, doesn't block rendering (4.3MB non-blocking).
- **Manifest:** `scope: "/"`, `dir: "rtl"`, `theme_color: "#080808"`.
- **`getReadDays()`:** Now calculates actual unique days from timestamped readLog instead of hardcoded `1`.
- **Dead CSS removed:** `.search-row`, `.scroll-slider`, `.surah-divider`, `.hist-day/*`, `.slide-in-*`, `.scroll-mode`, `.theme-transitioning` — 7 unused rule sets.
- **Card hover opacity:** 0.25 → 0.6. Card-read opacity: 0.2 → 0.35. Input focus opacity: 0.5 → 0.85.
- **Page mode:** Changed `overflow: hidden` to `overflow-y: auto` for scrollable content.
- **Focus mode:** Collapse bar/button now excluded from double-tap trigger.
- **Init flow:** `initDexie()` awaited before `loadReadLog()`. Dexie is authoritative, localStorage is fallback.
- **scroll→slide migration:** Now persists to localStorage.

### Fixed
- **Dexie migration bug:** Stores `{ key, timestamp }` instead of `{ key }` — preserves data integrity.
- **Race condition:** `initDexie()` is now properly awaited in `init()`.
- **Infinite recursion guard:** `renderVerses()` checks `state.verses.length > 0` before recursing.
- **Empty catch blocks:** Tafsir fetch failure now shows user feedback instead of silent fail.
- **Tafsir version tracking:** `state.tafsirFailed` flag prevents conflicting spinner state.

## 1.1.0 (2026-05-26)

- Added Tafsir Ibn Kathir (Arabic + English) from Quran.com v4 API.
- New tafsir editions: `ar-ibn-kathir` (6,205 ayah), `en-ibn-kathir` (6,236 ayah).

## 1.0.0 (2026-05-26)

- Initial release — Static JSON + PWA architecture.
- 114 surah, 6236 ayah with Arabic (Uthmani), Malay (Basmeih), English (Asad).
- Offline-first: all data served from local `data/*.json` files via Service Worker.
- Dark theme, monospace font, gold accent.
- Instagram-style flashcard UI with ayah-level read logging.
- Keyboard navigation (ArrowLeft, ArrowRight, Space).
- Read history and statistics tabs.
- Zero runtime server dependencies.
