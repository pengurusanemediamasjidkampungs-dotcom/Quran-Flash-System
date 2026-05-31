# Cadangan Struktur — Hub Dashboard Muslim

## Status Projek

```
Quran-Flash-System/
├── index.html              ← Launcher (grid pautan — NAK DIYUBAH)
├── quran.html              ← Quran (slide/page, tafsir, 4.3MB data.js)
├── sistem-waktu-solat/     ← Waktu solat (fetch API JAKIM, SW cache)
├── sistem-doa/             ← Doa & zikir (100% offline, data embed)
├── doa.html                ← Redirect ke sistem-doa/
├── zikir.html              ← Placeholder
```

**Masalah launcher semasa:** Grid pautan kosong — tiada nilai segera.

---

## Visi

`index.html` menjadi **dashboard harian muslim** — satu skrin yang pengguna nampak terus semua yang penting sebelum klik ke mana-mana modul.

---

## Reka Bentuk

### Layout

```
┌─────────────────────────────────┐
│  السلام عليكم · Khamis 29 Mei   │ ← header ringan, emas
│  29 Zulkaedah 1447H             │
│─────────────────────────────────│
│  🕌 Zohor · 01:13               │ ← waktu solat + countdown
│  ↓ 42 minit lagi                │
│─────────────────────────────────│
│  ﷽ Ayat hari ini               │ ← content berputar random
│  (ayat + terjemahan ringkas)    │
│─────────────────────────────────│
│  🤲 Doa hari ini                │
│  (doa + terjemahan)             │
│─────────────────────────────────│
│  [Quran] [Solat] [Doa] [Zikir]  │ ← bar navigasi
│─────────────────────────────────│
│  ⏰ Cadangan Rutin Harian       │
│  Subuh: Qiyam, Zikir, Bacaan    │
│  Pagi: Kerja, Jaga adab         │
│  Petang: Solat, Keluarga        │
│  Malam: Isyak, Tadabbur, Tidur  │
│─────────────────────────────────│
│  ⚠️ Peringatan                  │
│  Jaga lisan · Jaga pandangan    │
└─────────────────────────────────┘
```

### Prinsip

| Prinsip | Kenapa |
|---------|--------|
| **Satu skrin, semua penting** | Nilai segera tanpa klik |
| **Modul kekal berasingan** | quran.html, sistem-waktu-solat, sistem-doa — tak usik |
| **Dashboard neutral** | Baca dari data sedia ada (QURAN_DATA, localStorage, prayers[]) |
| **Rutin boleh ubah** | Cadangan, bukan paksaan — guna localStorage jika pengguna edit |
| **Peringatan ringan** | Nasihat pendek, bukan fatwa |

### Teknikal

| Komponen | Sumber Data | Offline |
|----------|-------------|---------|
| Waktu solat + countdown | Baca dari cache/localStorage (sistem-waktu-solat) | ✅ |
| Ayat hari ini | Random dari `data.js` (QURAN_DATA) | ✅ |
| Doa hari ini | Random dari data doa embed | ✅ |
| Rutin harian | JSON hardcode, editable | ✅ |
| Peringatan | Array ringkas | ✅ |

### Sumber Data Sedia Ada Boleh Guna Semula

| Data | Lokasi |
|------|--------|
| Waktu solat harian | `sistem-waktu-solat/` fetch dari GitHub API (dah cache) |
| Ayat + terjemahan | `data.js` — QURAN_DATA.v[surah][ayah] |
| Doa & zikir | `sistem-doa/script.js` — prayers object |
| Favourites doa | localStorage `duaa_favs` |
| Read log Quran | IndexedDB / localStorage |

---

## Soalan untuk Claude

1. **Dashboard vs Launcher** — patutkah index.html jadi dashboard penuh (dengan content) atau kekal grid tapi lebih kemas dengan widget?

2. **Sumber waktu solat** — waktu solat dashboard nak baca dari data yang fetch oleh sistem-waktu-solat (perlu coordination), atau guna formula kiraan offline (lebih merdeka)?

3. **Rutin Harian** — cadangan jadual yang seimbang antara ibadat, kerja, keluarga — perlukan rujukan dari fiqh Islam atau cukup dengan common sense?

4. **Peringatan** — skop peringatan: cukup nasihat umum (jaga lisan, jaga pandangan) atau perlu lebih spesifik ikut waktu/masa?

5. **Prioriti modul seterusnya** — sekarang Quran ✅, Solat ✅, Doa ✅, Zikir❌. Zikir (tasbih digital, zikir pagi/petang interactive) — bina dalam dashboard terus atau modul berasingan?

6. **CSS konsisten** — dashboard neutral dan setiap modul ada CSS sendiri. Perlukan satu design system (shared CSS vars) atau biar berbeza ikut mood setiap modul?

---

## Addendum: Pelaksanaan (31 Mei 2026)

### Keputusan Reka Bentuk

| Soalan | Keputusan |
|--------|-----------|
| Dashboard vs Launcher | **Dashboard penuh** — dengan widget langsung (waktu solat, ayat, doa, rutin, peringatan) |
| Sumber waktu solat | **Fetch dari API GitHub** JAKIM, cache SW, fallback ke data localStorage |
| Shared CSS | **Ya** — `shared-responsive.css` + `shared-responsive.js` untuk responsif terpusat. CSS mood modul kekal dalam direktori sendiri. |

### Responsif Telah Dilaksanakan

- **Dashboard**: `width: min(480px, 100vw - 1rem)` — fluid, bukan fixed
- **Orientasi landscape** (≤ 520px tinggi): header mampat, grid solat dikecilkan
- **Orientasi potret tablet** (≥ 600px lebar): padding luas, font lebih besar
- **Safe area**: `env(safe-area-inset-*)` untuk notched devices
- **iOS 100vh fix**: dynamic `--vh` via JS

### Navigasi

Dari [Quran] [Solat] [Doa] [Zikir] (4 modul) → **6 modul**: Dashboard, Quran, Vault, Doa, Kewangan, Menu — bottom nav bar tetap.
