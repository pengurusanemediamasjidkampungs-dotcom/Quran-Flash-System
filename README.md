# Quran Flash System

**Sistem Muslim harian offline-first dengan fokus tadabbur. PWA-enabled, berfungsi tanpa server.**

> *"Semakin sedikit gangguan visual, semakin dalam hubungan dengan teks wahyu."*

---

## Ciri Utama

| Ciri | Keterangan |
|------|-----------|
| **Offline-first** | Semua 6,236 ayat + terjemahan embed dalam `data.js` (4.3MB). Jalan terus dari `file://`. |
| **Pemilih Surah & Juz** | Menu carian surah 1-114 dengan juz filter (1-30). Nama Arab & rumi. |
| **Dua Mod Bacaan** | **Slide** (satu ayat, animasi anime.js) — **Muka Surat** (halaman maya, flip animation). |
| **Tema Dinamik** | Day-Light ☀️, Dark-Night 🌙, Coffee-Beige ☕. Tukar bila-bila. |
| **Mod Fokus** | Ketuk dua kali skrin — semua UI hilang, tinggal ayat sahaja. |
| **Sejarah & Statistik** | Rekod ayat yang telah dibaca (IndexedDB + Dexie.js). Stat surah & hari bacaan sebenar. |
| **PWA** | Install sebagai app. Service Worker cache semua aset. |
| **Tafsir** | Muyassar, Jalalayn, Ibn Kathir (Arab & Inggeris) — dimuat melalui internet, dicache offline. |
| **Animasi** | Slide/page transition dengan anime.js — smooth, 17KB. |
| **Dashboard Muslim** | Waktu solat, Ayat & Doa harian, rutin, peringatan — langsung dari hub. |
| **Sistem Modul** | Doa & Zikir, Vault, Kewangan Peribadi, Menu — setiap satu app PWA berasingan. |
| **Responsif Auto** | Adaptasi automatik 360px–1920px, portrait/landscape, safe area — semua sub-sistem. |

---

## Cara Guna

### Buka Terus (Offline)
Buka `index.html` terus dari Chrome/Firefox/Edge — **tanpa server**.

### Hosting (GitHub Pages, Netlify, dll.)
Upload semua fail ke mana-mana static hosting. Lepas first visit dari HTTPS, Service Worker register dan app jalan offline.

### Build Data
Kalau ada perubahan pada data JSON dalam folder `data/`, jana semula `data.js`:
```bash
python build-data.py
```

---

## Struktur Fail

```
Quran-Flash-System/
├── index.html                 # Dashboard Hub utama
├── quran.html                 # Quran Reader
├── app.js                     # Aplikasi utama (Quran)
├── style.css                  # CSS penuh (3 tema, mod fokus, midnight sublayer)
├── shared-responsive.css      # CSS responsive terpusat (semua sub-sistem)
├── shared-responsive.js       # JS responsive — viewport fix, orientation watcher
├── data.js                    # Semua ayat embed (4.3MB, auto-generated, defer)
├── sw.js                      # Service Worker
├── manifest.json              # PWA manifest
├── build-data.py / .bat       # Build scripts
├── data/                      # JSON ayat individu (001.json .. 114.json)
│   ├── surah_list.json
│   └── 001.json .. 114.json
├── data-tafsir/               # Tafsir (Muyassar, Jalalayn, Ibn Kathir)
├── assets/
│   ├── fonts/                 # Amiri, Scheherazade New, Uthman Naskh
│   ├── icons/                 # PWA icons
│   ├── anime.min.js           # Enjin animasi (17KB)
│   └── dexie.min.js           # IndexedDB wrapper (81KB)
├── sistem-doa/                # Modul Doa & Zikir
├── sistem-vault/              # Modul Vault (Password Manager)
├── sistem-kewangan/           # Modul Kewangan Peribadi
├── sistem-menu/               # Modul Menu
├── admin/                     # Panel admin
└── api/                       # API server (Express, port 3001)
```

---

## Data Sumber

Semua teks Al-Quran, terjemahan, dan tafsir bersumber dari [Quran Foundation](https://quran.foundation) melalui [quran.com](https://quran.com) dan [nuqayah.com](https://nuqayah.com).

- **Teks Arab**: Uthmanic Hafs (Mushaf al-Madinah)
- **Terjemahan Melayu**: Kementerian Hal Ehwal Agama, Brunei Darussalam
- **Terjemahan Inggeris**: Saheeh International
- **Tafsir Muyassar**: Kementerian Hal Ehwal Islam, Arab Saudi
- **Tafsir Jalalayn**: Imam Jalaluddin al-Mahalli & Jalaluddin al-Suyuti
- **Tafsir Ibn Kathir**: Imam Ibn Kathir

---

## Teknologi

- **Vanilla JS** — zero framework, zero bundler
- **Dexie.js** — IndexedDB wrapper untuk persistent storage
- **anime.js** — animasi JavaScript ringan (slide/page transition)
- **CSS Custom Properties** — 3 tema warna dinamik + midnight sublayer
- **CSS Container Queries** — komponen dalaman adaptif ikut ruang tersedia
- **Fluid Typography** — `clamp()` untuk saiz teks responsif automatik
- **Service Worker** — CacheFirst + NetworkFirst, dual cache partition
- **CSS Animations** — entrance, toast, progress bar, focus mode

---

## Responsive System

Sistem responsive terpusat `shared-responsive.css` + `shared-responsive.js` — satu sumber kebenaran untuk semua adaptasi:

### CSS Properties
```css
:root {
  --bp-xs: 360px;  --bp-sm: 480px;  --bp-md: 640px;
  --bp-lg: 768px;  --bp-xl: 1024px; --bp-xxl: 1280px;
  --safe-top / --safe-bottom / --safe-left / --safe-right;
  --vh: 1vh;  /* iOS Safari 100vh fix */
}
```

### Orientation
- `@media (orientation: landscape) and (max-height: 520px)` — maksimakan ruang menegak
- `@media (orientation: portrait) and (min-width: 600px)` — tablet single-column
- Sidebar jadi mini-bar dalam landskap (sistem-doa)
- Waktu solat grid mengecut dalam landskap (Hub)

### Breakpoints
| Kelas | Lebar | Peranti |
|-------|-------|---------|
| `.hide-xs` | ≤ 360px | Telefon kecil |
| `.hide-sm` | 361–480px | Telefon biasa |
| `.hide-md` | 481–639px | Phablet |
| `.hide-lg` | 640–1023px | Tablet potret |
| `.hide-xl` | 1024–1279px | Desktop |
| `.hide-xxl` | ≥ 1280px | Desktop besar |

### Viewport & iOS Fix
- `interactive-widget=resizes-content` — keyboard mobile tak timpa kandungan
- `--vh` dynamic property — betulkan 100vh bug pada Safari iOS
- `env(safe-area-inset-*)` — notched devices

---

## PWA

App ini memenuhi syarat PWA:
- ✅ Manifest (`manifest.json`) — scope `/`, dir `rtl`, theme `#080808`
- ✅ Service Worker (`sw.js`) — CacheFirst shell + NetworkFirst data tafsir
- ✅ Ikon 192x192 & 512x512 (maskable)
- ✅ Responsive design — semua saiz skrin, semua orientasi
- ✅ Works offline (index.html terus dari file://)
- ✅ Offline indicator bar
- ✅ Loading spinner untuk tafsir
- ✅ SW update notification

**First visit** mesti dari HTTPS (atau localhost) untuk register Service Worker.
Selepas tu, app boleh buka offline terus dari homescreen.

---

## Pembangunan

### Keperluan
- Python 3.7+ (untuk build data)
- Node.js 18+ (untuk API server)
- Mana-mana static server (atau buka `index.html` terus)

### Mulakan API Server (untuk ujian penuh)
```bash
cd api
npm install
npm run dev
# → http://localhost:3001
```

### Build Data
```bash
python build-data.py
```

---

## Lesen

**MIT License**

Kode sumber adalah bebas. Data Al-Quran dan terjemahan adalah hak milik pemilik asal masing-masing. Sila rujuk [Quran Foundation](https://quran.foundation) untuk terma penggunaan data.

---

> Dibina dengan niat untuk memudahkan tadabbur Al-Quran.
