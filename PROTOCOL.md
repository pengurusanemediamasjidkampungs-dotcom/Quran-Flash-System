# PROTOCOL.md — Protocol Pengubahsuaian & Pembangunan

Dokumen ini menetapkan peraturan dan protokol yang mesti diikuti semasa mengubah suai atau menambah ciri pada Quran-Flash-System. Tujuannya adalah untuk memastikan konsistensi, kestabilan, dan kesucian falsafah asal projek.

## Prinsip Asas

### 1. Offline-First (Kedudukan Luar Talian)

**Setiap ciri baru MESTI berfungsi sepenuhnya dalam persekitaran luar talian.** Jika sesuatu ciri memerlukan internet, ia mesti:
- Mempunyai fallback yang bermakna apabila offline
- Tidak menghalang fungsi teras aplikasi semasa offline

✅ **Contoh betul:** Ciri tafsir — muat dari cache SW jika offline, tunjuk spinner semasa loading
❌ **Contoh salah:** Ciri yang hanya jalan bila online dan rosak total bila offline

### 2. Tiada Server Runtime (Tiada Pelayan Waktu Jalan)

Aplikasi ini mesti boleh dihost secara statik (GitHub Pages, Netlify, atau `file://`). Tiada backend, database server, atau API yang mesti jalan. Satu-satunya pengecualian adalah fetch API untuk sumber luaran (contoh: tafsir) yang dimuat secara on-demand dan dicache oleh Service Worker.

### 3. Vanilla-First dengan Pengecualian Terhad

**Guna Vanilla JavaScript seboleh mungkin.** Pengecualian terhad:

| Library | Versi | Saiz | Tujuan | Justifikasi |
|---------|-------|------|--------|-------------|
| **Dexie.js** | 4.0.8 | 81KB | IndexedDB wrapper | localStorage tidak muat untuk readLog dengan timestamp; akses IndexedDB asli terlalu verbose untuk 7 operasi CRUD berbeza |
| **anime.js** | 3.2.2 | 17KB | Animasi slide/page | CSS transitions tidak cukup powerful untuk slide-out/slide-in async timing yang kompleks; native WAAPI terlalu verbose |

Kedua-dua disimpan secara **lokal** dalam `assets/`, diprecache oleh Service Worker, dan berfungsi offline sepenuhnya.

### 4. CSS Sebagai Medium Visual Utama

Animasi ringkas (entrance, hover, focus) dan tema (3 warna) dikendalikan oleh CSS. anime.js hanya untuk navigasi kompleks (slide/page transition) yang memerlukan koordinasi timing antara elemen masuk dan keluar.

### 5. Satu Halaman (SPA)

Aplikasi ini adalah **Single Page Application**. Semua pandangan (carian surah, slide ayat, statistik) dikendalikan melalui manipulasi DOM dalam halaman yang sama. Tiada penghalaan URL atau pemuatan halaman berasingan (`#` anchor dibenarkan untuk navigasi).

### 6. Kemerosotan Anggun (Graceful Degradation)

Setiap ciri mesti direka dengan andaian bahawa sesetengah persekitaran mungkin tidak menyokongnya. Contoh:
- Jika Service Worker gagal register, aplikasi tetap jalan — cuma tak ada offline caching.
- Jika IndexedDB tidak tersedia (Dexie gagal), fallback ke localStorage.
- Jika fetch tafsir gagal (offline dan tiada cache), guna terjemahan biasa.
- Jika anime.js gagal dimuat, slide/page masih berfungsi — cuma tanpa animasi.

### 7. Dua Mod Bacaan (Dual Mode)

- **Slide Mode** — Satu ayat pada satu masa, navigasi kiri/kanan (atau keyboard ArrowLeft/ArrowRight/ArrowDown/ArrowUp/Space). Sesuai untuk tadabbur.
- **Page Mode** — Paparan 10-15 ayat dalam satu skrin maya, navigasi seperti muka surat fizikal. Sesuai untuk bacaan pantas atau review.

## Protokol Pengubahsuaian

### A. Perubahan IndexedDB / Storage

1. **IndexedDB adalah authoritative source untuk state pengguna.** localStorage hanya fallback.
2. Setiap entri readLog mesti mengandungi sekurang-kurangnya `{ surah, ayah, timestamp }`.
3. Jika mengubah skema IndexedDB, sediakan logic migrasi.
4. Jangan simpan data kanun (teks Al-Quran) dalam IndexedDB — semua teks datang dari data.js.
5. Operasi IndexedDB mesti di-await dengan betul dalam `init()`.

### B. Perubahan DOM (HTML/CSS)

1. **Struktur DOM index.html adalah muktamad.** Sebarang perubahan pada struktur utama mesti disemak silang dengan app.js untuk memastikan pemilih (selectors) tidak rosak.
2. **CSS class names** untuk tema: `data-theme` attribute (`day-light`, `dark-night`, `coffee-beige`).
3. **CSS id** untuk komponen: gunakan ID yang bermakna dan konsisten dengan konvensyen yang sedia ada (contoh: `#chat`, `#slide`, `#page`, `#tafsir-box`).

### C. Perubahan JavaScript (app.js)

1. **State object** (`state`) adalah satu-satunya tempat untuk data aplikasi.
2. **Jangan terus cache elemen DOM** dengan querySelector berulang — simpan rujukan di state jika perlu.
3. **Anime.js** digunakan melalui `anime()` function global — hanya untuk animasi complex, bukan untuk perubahan gaya kekal.
4. Semua `fetch()` untuk tafsir mesti ada catch handler yang bermakna.
5. **Dexie** diakses melalui `new Dexie()` — operasi async mesti di-await.

### D. Perubahan Service Worker

1. **Versi cache** dalam sw.js: gunakan corak `quran-shell-v{versi}` dan `quran-data-v{versi}`.
2. **CacheFirst** untuk app shell (HTML, CSS, JS, fonts, icons).
3. **NetworkFirst** untuk data tafsir (JSON).
4. Apgrade versi → buang cache lama dalam event `activate`.
5. Jangan precache data.js — cukup dengan CacheFirst pada runtime.

### E. Perubahan data.js / Data Build

1. **Jangan edit data.js secara manual.** Sentiasa guna `python build-data.py`.
2. **Format data.js:**
   ```js
   var QURAN_DATA = { "v": [ ... ] };
   ```
   Struktur: `QURAN_DATA.v[surahId]` → array ayat (1-indexed).
3. **Jangan alihkan atau rename** struktur data sedia ada — banyak rujukan dalam app.js bergantung pada struktur semasa.

### F. Penambahan Tema Baru

1. Tambah dalam CSS sebagai attribute selector `[data-theme="nama-tema"]`.
2. Daftar dalam `themes` array di app.js (nama, ikon CSS class).
3. Pastikan kontras warna mencukupi untuk kebolehbacaan.

### G. Pengendalian Ralat (Error Handling)

1. **Tiada empty catch blocks.** Setiap catch mesti ada sekurang-kurangnya `console.warn()` atau feedback pengguna.
2. **Gunakan try/catch untuk operasi async:** fetch, Dexie, Web Animation API.
3. **Ralat rangkaian:** tunjuk mesej yang sesuai (contoh: "Tafsir luar talian — guna terjemahan biasa").
4. **Ralat Dexie:** fallback ke localStorage dengan logging.

### H. Logging / Debug

1. **Gunakan `console.log` secara sederhana** dan padam sebelum release.
2. **Gunakan `console.warn` untuk situasi luar biasa** yang tidak memerlukan campur tangan.
3. **Jangan log data pengguna** (readLog, PII).
4. **SW logging:** hanya untuk install, activate, dan cache miss.

### I. Responsive Design (Wajib)

1. **Setiap sub-sistem WAJIB paut `shared-responsive.css`** — satu-satunya sumber kebenaran responsive.
2. **Setiap sub-sistem WAJIB paut `shared-responsive.js`** — viewport fix + orientation watcher.
3. **Media queries khusus modul** — letak dalam CSS modul sendiri, guna breakpoints dari `shared-responsive.css`.
4. **Orientation wajib diuji** — fungsi mesti sama dalam portrait dan landscape.
5. **Safe area insets wajib** — `env(safe-area-inset-*)` untuk notched devices.
6. **`user-scalable=no` DILARANG** — guna `viewport-fit=cover` + `interactive-widget=resizes-content`.
7. **Touch targets minimum 44px** — untuk accessibility.
8. **`prefers-reduced-motion`** — semua animasi mesti ada fallback.

## Kesimpulan

Protokol ini direka untuk memastikan Quran-Flash-System kekal:
- **Stabil** — tiada perubahan yang merosakkan fungsi sedia ada
- **Minimum** — tiada code bloat atau library yang tidak perlu
- **Offline-first** — berfungsi dalam apa jua keadaan rangkaian
- **Konsisten** — setiap pengubahsuaian mengikut corak yang sama

Sebarang perubahan yang tidak mematuhi protokol ini mesti dibincang dan diluluskan sebelum diimplementasi.
