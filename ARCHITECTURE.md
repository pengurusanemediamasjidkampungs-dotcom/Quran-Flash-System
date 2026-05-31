# ARCHITECTURE.md — Quran-Flash-System  
**Static JSON + PWA | Offline-First | Zero-Server Runtime**

## 1. Data Flow & Data Constraints

### 1.1 Aliran Data

Semua teks Al-Quran (Arab, terjemahan Bahasa Melayu, terjemahan Bahasa Inggeris) dibekukan dalam fail `data.js` yang dimuat secara **defer** (tidak menyekat rendering). Tiada pangkalan data pelayan. Proses pembinaan dilakukan sekali (one-time build) melalui skrip eksport yang menghasilkan struktur berikut:

```
[Quran Data Sources]
        |
build-data.py               (menghasilkan data.js dan fail data/)
        |
/data/                       (fail individu — redundant, untuk rujukan)
  001.json ... 114.json
        |
data.js                     (bundel 4.3MB — dimuat dengan <script defer>)
        |
Service Worker (sw.js)      CacheFirst untuk app shell, NetworkFirst untuk tafsir
        |
app.js                      parse QURAN_DATA, simpan di state.verses
        |
renderVerses() / renderPage()   suntikan DOM ke #chat
```

Aliran runtime:
1. Halaman dibuka → HTML parse tanpa blok (data.js defer).
2. Deferred scripts selesai (Dexie → anime → data.js → app.js).
3. `DOMContentLoaded` → `init()`: init IndexedDB (Dexie.js), muat readLog, papar surah terakhir.
4. `loadVerses()` membaca `QURAN_DATA.v[surahId]` (dari data.js) terus dari memori.
5. Tafsir dimuat melalui `fetch()` — dicegah oleh SW dengan strategi NetworkFirst.
6. `renderVerses()` (Slide mode) atau `renderPage()` (Page mode) menjana kad ayat.
7. Navigasi Slide/Page menggunakan **anime.js** untuk transisi smooth.

### 1.2 Kekangan Data (Read-Only Immutable)

- **Semua fail dalam `data/` adalah sumber kebenaran kanun (canonical source of truth) dan bersifat baca sahaja.**  
  Tiada fungsi aplikasi – sama ada `app.js`, `sw.js`, atau mana-mana modul masa depan – dibenarkan menulis, mengubah, atau menstruktur semula sebarang fail di bawah `data/`. Fail-fail ini dianggap kekal selepas eksport awal.

- **Skema JSON adalah beku (frozen).**  
  Struktur berikut tidak boleh diubah oleh kod masa jalan:
  ```json
  {
    "id": <nombor>,
    "name": "<nama Arab>",
    "name_en": "<nama Rumi>",
    "revelation": "Meccan | Medinan",
    "ayat": [
      { "ayah": <nombor>, "arabic": "...", "ms": "...", "en": "..." }
    ]
  }
  ```
  Sebarang keperluan untuk data terbitan mesti dilaksanakan dalam ingatan (in-memory) atau dalam IndexedDB, dan tidak boleh disimpan semula ke dalam fail asal.

- **Aplikasi mesti berfungsi sepenuhnya tanpa panggilan API luaran semasa runtime.**  
  Semua kandungan Al-Quran telah dibakar ke dalam `data.js`. Sistem tidak dibenarkan bergantung kepada perkhidmatan luar untuk teks utama. Tafsir dimuat secara on-demand dan dicache oleh SW.

## 2. Component Structure

Sistem terdiri daripada lima fail teras yang sempadan tanggungjawabnya dipisahkan secara ketat:

| Fail | Tanggungjawab | Tidak Pernah Menyentuh |
|------|---------------|------------------------|
| `index.html` | Struktur DOM, meta tag, `<link>` ke CSS, `<script defer>` ke JS, SW registration on load | Logik perniagaan, penggayaan, pengurusan cache |
| `style.css` | Semua persembahan visual – palet warna, tipografi, jarak, animasi, titik putus responsif. | Struktur DOM, pemuatan data, pengendalian acara |
| `shared-responsive.css` | Sistem responsive terpusat — breakpoints, orientation, container queries, fluid typography, safe area, accessibility. Dipaut semua sub-sistem. | Struktur DOM, kelas CSS sub-sistem (hanya set pemboleh ubah) |
| `shared-responsive.js` | Viewport height fix (iOS), orientation & screen-size watcher. Dipaut semua sub-sistem. | Manipulasi DOM, CSS selain `--vh` dan atribut `data-*` |
| `app.js` | Keadaan aplikasi (`state`), pemuatan JSON, pemaparan, pengendali acara, IndexedDB (Dexie.js), anime.js | Fail JSON pada cakera (kecuali baca), kelas CSS (hanya toggel) |
| `sw.js` | CacheFirst untuk app shell, NetworkFirst untuk data tafsir, dual-cache partition | Manipulasi DOM, keadaan aplikasi, IndexedDB |
| `assets/dexie.min.js` | IndexedDB wrapper — baca/tulis readLog | DOM, cache, CSS |
| `assets/anime.min.js` | Enjin animasi — slide/page transitions | Data, DOM struktur |

### Hubungan Antara Komponen
- `index.html` menyediakan cangkerang; SW registration dalam `window.load` listener.
- `app.js` adalah pengawal tunggal: membaca `state` dari IndexedDB (Dexie.js) dengan fallback localStorage, memuatkan surah dari QURAN_DATA, memanggil fungsi pemaparan, dan memasang pendengar acara.
- `style.css` menggunakan CSS custom properties untuk tema; `app.js` hanya toggel `data-theme` attribute. anime.js menetapkan gaya inline secara sementara semasa animasi.
- `sw.js` bertindak sebagai proksi dengan dual-cache: `quran-shell-v5` (CacheFirst) dan `quran-data-v5` (NetworkFirst).

## 3. State Integrity (Keutuhan Keadaan)

Semua keadaan pengguna dipegang secara eksklusif dalam IndexedDB (Dexie.js) dengan fallback localStorage. Tiada data kemajuan dihantar ke pelayan.

### Lapisan Storan

| Lapisan | Teknologi | Keterangan |
|---------|-----------|------------|
| **Primari** | IndexedDB (Dexie.js) | `readLog` dengan timestamp, prestasi tinggi, muatan besar |
| **Fallback** | `localStorage` | Digunakan jika Dexie gagal dimuat atau IndexedDB tidak disokong |

### Kunci localStorage (Legacy/Darurat)

| Kunci | Jenis | Keterangan |
|-------|-------|------------|
| `quran_read_log` | `Record<"surah:ayah", string>` | Timestamp ayat yang telah selesai dibaca (contoh: `"1:5": "2026-05-29"`) |
| `quran_prefs` | `{ lang, theme, font, fontSize, readingMode, hideControls }` | Keutamaan pengguna |

### Jaminan Keutuhan

1. **IndexedDB adalah lapisan ketekalan utama.**  
   `initDexie()` di-await dalam `init()` — tiada race condition. Jika Dexie gagal, localStorage digunakan.

2. **Pemulihan sesi.**  
   Apabila `DOMContentLoaded`, `app.js` membaca IndexedDB/localStorage, menetapkan `state`, lalu memanggil `loadVerses()`. Paparan terakhir dipulihkan.

3. **Log bacaan tidak mencemari data kanun.**  
   Fungsi `isAyahRead(surah, ayah)` hanya menyemak kewujudan kunci di dalam `state.readLog`. Data asal tidak disentuh. Penanda visual dijana semasa render.

4. **Tiada risiko kehilangan data.**  
   Menghapuskan IndexedDB hanya menetapkan semula kemajuan pengguna; ia tidak menjejaskan integriti Al-Quran. Dexie disimpan dalam `assets/dexie.min.js` dan di-precache SW.

## 4. PWA / Offline Architecture

### Strategi Service Worker: CacheFirst + NetworkFirst

Dual-cache partition untuk pengurusan aset yang lebih baik:

```
CacheFirst (quran-shell-v5):
  index.html, style.css, app.js, data.js, manifest.json
  assets/fonts/*, assets/icons/*, assets/anime.min.js, assets/dexie.min.js
  ──> Cache dulu, baru fetch jika tiada

NetworkFirst (quran-data-v5):
  data-tafsir/**/*.json
  ──> Fetch dulu, cache respons, fallback ke cache jika offline
```

### Populasi Cache

| Fasa | Mekanisme | Kandungan |
|------|-----------|-----------|
| **Install** | `install` event dalam `sw.js` | Semua SHELL_URLS (CacheFirst) |
| **Runtime** | `fetch` handler (NetworkFirst) | Tafsir JSON, dicache secara malas apabila dilawati |
| **Activate** | `activate` event | Buang semua cache yang tidak sepadan dengan `quran-shell-v5` / `quran-data-v5` |

Cache dinamakan dengan corak `quran-{jenis}-v{versi}` (contoh: `quran-shell-v5`). Apabila versi bertukar, event `activate` akan memadam cache yang tidak sepadan.

### Jaminan Luar Talian

Selepas satu lawatan penuh (semua aset shell + tafsir yang pernah diakses), keseluruhan aplikasi adalah mandiri. CacheFirst memastikan shell dimuat serta-merta. NetworkFirst memastikan tafsir dikemas kini jika online, dan masih berfungsi dari cache jika offline.

### Animasi Luar Talian (anime.js)

`assets/anime.min.js` (17KB) di-precache dalam shell. Semua animasi slide dan page flip berfungsi offline sepenuhnya.

### IndexedDB Luar Talian (Dexie.js)

`assets/dexie.min.js` (81KB) di-precache dalam shell. Semua operasi readLog berfungsi offline. Timestamps disimpan untuk pengiraan statistik hari bacaan yang tepat.

## 5. Integration Rules (Protokol Non-Destructive)

Sebarang penambahan ciri masa depan MESTI mematuhi peraturan berikut untuk mengekalkan kestabilan seni bina dan falsafah minimalis:

### Peraturan 1 — Data Mentah Tidak Boleh Diubah
Tiada fungsi, modul, atau langkah binaan boleh mengubah suai fail dalam `data/` selepas eksport awal. Data tambahan mesti diletakkan dalam direktori baharu atau diurus dalam IndexedDB.

### Peraturan 2 — Ciri Tambahan Mesti Bersifat Tambahan (Append-Only)
- Komponen UI baru masuk ke dalam `index.html` sedia ada.
- Varian gaya visual masuk ke dalam `style.css`.
- Sumber data baharu masuk sebagai fail JSON baru di bawah `data/` atau IndexedDB.
- Strategi cache baru hanya dalam `sw.js`, tidak memintas logik sedia ada.

### Peraturan 3 — Tiada Kebergantungan Pelayan Wajib
Sebarang ciri yang memerlukan pelayan mestilah opt-in dan merosot dengan anggun. Pengalaman membaca teras mesti kekal berfungsi sepenuhnya tanpa sambungan rangkaian.

### Peraturan 4 — Tiada Langkah Binaan Wajib (Build Step)
Projek mesti kekal sebagai fail sumber yang boleh disampaikan terus. Jika ciri memerlukan kompilasi, ia mesti diasingkan ke dalam skrip yang dijalankan secara manual.

### Peraturan 5 — IndexedDB Sebagai Sumber Tunggal Keadaan Pengguna
Semua keutamaan, kemajuan bacaan, dan data sesi pengguna mesti disimpan dalam IndexedDB (Dexie.js) dengan fallback localStorage. Tiada pangkalan data jauh atau sistem akaun sebagai keperluan utama.

---

*Dokumen ini adalah sumber kebenaran seni bina. Sebarang kod yang melanggar kekangan ini mesti ditolak semasa semakan.*
