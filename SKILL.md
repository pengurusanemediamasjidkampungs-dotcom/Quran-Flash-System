# SKILL.md — Quran Hub Muslim Dashboard

Panduan seni bina, pembangunan, dan penyelenggaraan sistem modular Muslim Dashboard.

---

## 1. Visi

Satu aplikasi web offline-first yang menjadi **pusat harian muslim** — dashboard utama yang memaparkan keperluan ibadat harian (waktu solat, ayat, doa, zikir) dengan akses pantas ke modul khusus.

### Prinsip Utama

| Prinsip | Maksud |
|---------|--------|
| **Offline-first** | Semua modul berfungsi tanpa internet. Data embed atau cache SW. |
| **Modular** | Setiap modul berdiri sendiri dalam direktori sendiri. Tiada konflik CSS/JS. |
| **Dashboard-sentral** | `index.html` adalah pusat — papar widget langsung dari semua modul. |
| **Nilai segera** | Buka → nampak terus waktu solat, ayat, doa. Bukan grid pautan kosong. |
| **Kembangkan ikut masa** | Modul baru = direktori baru. Tak perlu ubah modul lain. |

---

## 2. Seni Bina Modular

```
quran-hub/
├── index.html              ← DASHBOARD (pusat harian)
├── quran.html              ← MODUL: Al-Quran (slide, page, tafsir)
├── app.js                  ← Logik Quran (tafsir fetch, dexie, anime)
├── style.css               ← Gaya Quran (font, tema, layout)
├── shared-responsive.css   ← SISTEM RESPONSIF TERPUSAT (semua modul)
├── shared-responsive.js    ← Viewport fix + orientation watcher (semua modul)
├── data.js                 ← Data Quran 114 surah (4.3MB, shared)
├── manifest.json           ← Manifest utama (hub PWA)
├── sw.js                   ← Service Worker (CacheFirst shell + NetworkFirst data)
│
├── sistem-doa/             ← MODUL: Doa & Zikir
│   ├── index.html, style.css, script.js, manifest.json
│
├── sistem-vault/           ← MODUL: Vault (Password Manager)
│   └── index.html
│
├── sistem-kewangan/        ← MODUL: Kewangan Peribadi
│   └── index.html
│
├── sistem-menu/            ← MODUL: Menu & Tetapan
│   └── index.html
│
├── admin/                  ← PANEL ADMIN
│   └── index.html, css/admin.css
│
├── api/                    ← API SERVER (Express, port 3001)
│   └── server.js, package.json
│
├── assets/                 ← Sumber kongsi
│   ├── fonts/, icons/
│   ├── anime.min.js, dexie.min.js
│
├── data-tafsir/            ← Tafsir (muyassar, jalalayn, ibn-kathir)
│
├── docs/                   ← Dokumentasi reka bentuk & rujukan
│   ├── DESIGN_Hub_Dashboard.md
│   ├── DESIGN_Premium_by_Claude.md
│   ├── DESIGN_Premium_by_DeepSeek.md
│   └── references/
│       ├── muslim_dashboard_mockup.html
│       └── kewangan_dashboard.html
│
└── data/                   ← Data JSON individu (untuk build)
```

### Modul — Tanggungjawab

| Modul | Fail Utama | Sumber Data | Offline | Ketergantungan Luar |
|-------|-----------|-------------|---------|---------------------|
| **Dashboard** | `index.html` | Semua modul lain (baca sahaja) | ✅ | 0 |
| **Quran** | `quran.html` | `data.js` (embed) | ✅ | 0 |
| **Doa & Zikir** | `sistem-doa/` | `script.js` (embed) | ✅ | 1 Google Fonts |
| **Vault** | `sistem-vault/` | `localStorage` | ✅ | 0 |
| **Kewangan** | `sistem-kewangan/` | `localStorage` | ✅ | 0 |
| **Menu** | `sistem-menu/` | `localStorage` | ✅ | 0 |
| **Admin** | `admin/` | API server | ❌ (perlu server) | Node.js |
| **Shared Responsive** | `shared-responsive.css` + `.js` | — | ✅ | 0 |

### Peraturan Modular

1. **Setiap modul dalam direktori sendiri** — kecuali modul ringkas (single file seperti quran.html).
2. **CSS/JS responsive dikongsi** — semua modul WAJIB paut `shared-responsive.css` dan `shared-responsive.js`. CSS khusus modul kekal dalam direktori sendiri.
3. **Dashboard adalah pembaca** — dia baca dari data sedia ada (QURAN_DATA, localStorage, dll.), bukan menulis.
4. **Komunikasi antara modul** — melalui localStorage atau IndexedDB. Tiada global variables.
5. **Modul baru** — copy template direktori, paut shared-responsive, isi kandungan. Tak perlu ubah modul lain.

---

## 3. Dashboard (index.html)

Dashboard adalah komponen paling penting — **skrin pertama** pengguna setiap kali buka app.

### Komponen Wajib

| Zon | Komponen | Sumber Data |
|-----|----------|-------------|
| **Header** | Salam, tarikh masihi + hijrah | JavaScript Date() + localStorage |
| **Waktu Solat** | Waktu semasa + countdown + grid solat | Fetch dari cache atau API (sistem-waktu-solat) |
| **Ayat Hari Ini** | Ayat random + terjemahan | data.js (QURAN_DATA) |
| **Doa Hari Ini** | Doa random | Embed data dalam JS |
| **Rutin Harian** | Cadangan jadual seimbang (4 waktu) | Embed JSON |
| **Peringatan** | Nasihat ringkas | Embed array |
| **Navigasi** | Bar 6 modul (Quran, Vault, Doa, Kewangan, Menu) + Dashboard | Link ke halaman modul |

### Layout

```
┌─────────────────────────────────┐
│  السلام عليكم · Khamis 29 Mei   │
│  29 Zulkaedah 1447H             │
├─────────────────────────────────┤
│  🕌 Zohor · 01:13               │
│  ↓ 42 minit lagi                │
│  [Subuh] [Syuruk] [Zohor] [Asar] [Maghrib] │
├─────────────────────────────────┤
│  ﷽ Ayat hari ini                │
│  (ayat + terjemahan)            │
├─────────────────────────────────┤
│  🤲 Doa hari ini                │
│  (doa + terjemahan)             │
├─────────────────────────────────┤
│  [Quran] [Vault] [Doa] [Kewangan] [Menu]  │
│  (bottom nav bar fixed)                    │
├─────────────────────────────────┤
│  ⏰ Cadangan Rutin Harian       │
│  ● Subuh — Qiyam, zikir, tilawah│
│  ● Pagi — Kerja, jaga adab      │
│  ● Petang — Asar, keluarga       │
│  ● Malam — Isyak, tadabbur      │
├─────────────────────────────────┤
│  ⚠️ Peringatan                   │
│  "Jaga lisanmu..."              │
└─────────────────────────────────┘
```

### Interaktiviti

| Elemen | Tindakan |
|--------|----------|
| Waktu solat + countdown | Update setiap saat (JS setInterval) |
| Ayat "↻ lain" | Random ayat baru dari QURAN_DATA |
| Nav icon | Buka modul di page berasingan |
| Rutin boleh diedit | LocalStorage — pengguna boleh ubah suai |

---

## 4. Modul Reference

### 4.1 Quran (quran.html)

- **Dua mode**: Slide (satu ayat) dan Page (muka surat maya)
- **Tafsir**: Muyassar, Jalalayn, Ibn Kathir — fetch on demand, SW cache
- **Storage**: IndexedDB (Dexie.js) untuk readLog + fallback localStorage
- **Animasi**: anime.js untuk slide/page transition
- **Data**: data.js (4.3MB) — defer loading, non-blocking

### 4.2 Waktu Solat (sistem-waktu-solat/)

- **Data**: Fetch dari GitHub API (data JAKIM) — network-first, fallback cache
- **Negeri**: Selangor (3 zon), Johor (4 zon)
- **Countdown**: Live ke waktu solat seterusnya
- **Background**: Dinamik ikut waktu (subuh, siang, asar, malam)
- **Tema**: 14 tema + 256 custom warna
- **Poster**: Muat turun JPG via html2canvas
- **Kongsi**: WhatsApp share

### 4.3 Doa & Zikir (sistem-doa/)

- **Data**: Semua embed dalam script.js — 100% offline
- **Koleksi**: 10 koleksi (solat, ayat, permohonan, ayat kursi, mathurat, dll.)
- **Carian**: Cari dalam arabic + translation — realtime filter
- **Kesukaan**: ❤️ simpan ke localStorage
- **Kongsi**: Native share API / clipboard
- **Sidebar**: Dark sidebar (desktop) + bottom nav (mobile)
- **Waktu**: Jam live + pemilih lokasi

### 4.4 Kewangan (kewangan.html)

- **Tab**: Balance Sheet, Pendapatan, Pelaburan, Bil & Hangus
- **Data**: localStorage + data embed — 100% offline
- **Zakat**: Kalkulator automatik 2.5%
- **Portfolio**: Tracking untung/rugi pelaburan

---

## 5. Data Flow & Storage

### Storan

| Storage | Guna Untuk |
|---------|-----------|
| **localStorage** | Quran prefs (theme, font, mode), doa kesukaan, lokasi, kewangan data |
| **IndexedDB (Dexie)** | Quran readLog (timestamp) |
| **Service Worker Cache** | Tafsir JSON, app shell, assets |

### Data Flow Antara Modul

```
Dashboard (index.html)
  │
  ├── Baca QURAN_DATA (dari data.js) → Ayat hari ini
  ├── Baca waktu solat (dari cache localStorage/API) → Widget Solat
  ├── Baca doa (dari embed JS) → Doa hari ini
  ├── Baca localStorage (duaa_loc) → Lokasi
  └── Link ke modul → quran.html, sistem-waktu-solat/, sistem-doa/, kewangan.html
```

### Service Worker (sw.js)

| Cache | Strategi | Kandungan |
|-------|----------|-----------|
| `quran-shell-v5` | CacheFirst | index.html, quran.html, style.css, app.js, data.js, manifest.json, assets/* |
| `quran-data-v5` | NetworkFirst | data-tafsir/**/*.json |

Setiap modul juga boleh daftar SW sendiri (contoh: sistem-waktu-solat ada service-worker.js sendiri).

---

## 6. Pembangunan

### Cara Tambah Modul Baru

```
1. Buat direktori:  modul-baru/
2. Buat fail:       modul-baru/index.html, style.css, script.js, manifest.json
3. Paut dari dashboard:  tambah card/nav di index.html
4. Update SKILL.md:  tambah ke jadual modul
5. Jika ada data:    embed dalam JS atau fetch + SW cache
```

### Toolchain

- **Zero build tool** — semua fail mentah, tiada npm/webpack
- **Python 3.7+** — hanya untuk `build-data.py` (jana data.js)
- **Git** — version control
- **Service Worker** — guna native Cache API, tiada Workbox

### Testing

- Buka `index.html` terus dari file:// atau localhost
- Uji offline (DevTools → Network → Offline)
- Uji PWA (Lighthouse → PWA audit)
- Uji setiap modul berdiri sendiri
- **Uji responsif** — resize browser ke 360px, 480px, 768px, 1024px
- **Uji orientasi** — portrait dan landscape pada setiap breakpoint
- **Uji safe area** — pada device notched (iPhone X+) atau simulator

---

## 7. Konvensyen

| Aspek | Konvensyen |
|-------|-----------|
| **Bahasa** | Melayu (antara muka), Inggeris (code comments, documentation) |
| **Indentation** | 2 spaces |
| **CSS** | Flat CSS (tiada preprocessor). Naming: `.component-name` |
| **JS** | Vanilla JS, IIFE pattern, fungsi dalam `(function(){ ... })()` |
| **Font** | Google Fonts (system font fallback jika offline) |
| **Ikon** | SVG inline (tiada icon library) |
| **Data** | JSON embed dalam JS variable global |
