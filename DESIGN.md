# DESIGN.md — Quran Hub Muslim Dashboard

**Sistem Reka Bentuk Visual untuk Aplikasi Ibadat Harian Modular & Offline-First**

---

## 1. Falsafah Reka Bentuk

> *"Satu skrin, semua penting. Setiap modul, satu fokus."*

Reka bentuk ini berpegang kepada dua prinsip yang kelihatan bercanggah tetapi saling melengkapi:

1. **Dashboard sebagai pusat** — ringkas, hangat, nilai segera. Pengguna nampak semua keperluan ibadat harian dalam satu pandangan.
2. **Modul khusus sebagai tempat fokus** — setiap modul ada watak sendiri. Quran sunyi dan minimalis. Waktu solat dinamik dan kaya warna. Doa bersih dan tenang. Kewangan profesional dan tersusun.

Tiada satu tema yang memaksa semua modul kelihatan sama. Setiap modul ada "mood" yang sesuai dengan fungsinya.

---

## 2. Prinsip Modular Visual

| Modul | Mood | Warna Dominan | Font | Gaya |
|-------|------|---------------|------|------|
| **Dashboard** | Hangat, prihatin | Emas (#B8860B), krim (#fbfaf6) | DM Sans | Kad bersih, grid, widget ringkas |
| **Quran** | Sunyi, khusyuk | Hitam (#080808), emas sufi (#c9a86c) | Amiri (arab), Courier (rumi) | Flashcard, minimal, tiada gangguan |
| **Waktu Solat** | Dinamik, spiritual | Hijau gelap (#053b29), emas (#d4af37) | Nunito Sans | Glassmorphism, countdown live, background ikut waktu |
| **Doa & Zikir** | Lembut, tenang | Krim (#fbfaf6), emas (#b8860b) | DM Sans + Amiri | Sidebar dark, kad putih, ruang lapang |
| **Kewangan** | Profesional, teratur | Neutral (#f8f9fa), biru/hijau untuk status | DM Sans / system | Table, tab panel, progress bar, cards |

---

## 3. Palet Warna

### Warna Kongsi (semua modul)

| Token | Nilai | Guna |
|-------|-------|------|
| `--gold` | `#B8860B` / `#c9a86c` | Aksen utama, tajuk, ikon aktif |
| `--gold-light` | `#DAA520` / `#d4af37` | Waktu solat, highlight |
| `--gold-bg` | `rgba(218,165,32,0.08)` | Latar widget, card hover |
| `--gold-border` | `rgba(184,134,11,0.2)` | Border halus |
| `--danger` | `#dc3545` | Peringatan, hutang, status bahaya |
| `--success` | `#28a745` | Sudah bayar, positif, selesai |
| `--warning` | `#ffc107` | Belum bayar, perhatian |

### Palet Khas Modul

#### Dashboard
```
--bg:          #fbfaf6 (krim hangat)
--bg-card:     #ffffff
--text:        #1a1a1a
--text-muted:  #6b7280
```

#### Quran
```
--bg-primary:     #080808 / #faf8f2 / #e8d9c8 (3 tema)
--bg-card:        #0d0d0d / #ffffff / #f3eade
--text-primary:   #dddddd / #1a1a1a / #3b2e21
--arabic:         #c9a86c / #1e3a2f / #5d3a1a
```

#### Waktu Solat
```
--dynamic-bg:  gradient ikut waktu (subuh→siang→asar→malam)
--text-main:   #ffffff
--gold-premium: #d4af37
```

#### Doa
```
--bg:          #fbfaf6
--bg-sidebar:  #1a1a2e (dark)
--text-sidebar: #e0e0e0
```

#### Kewangan
```
--bg:          #f8f9fa
--bg-card:     #ffffff
--text:        #1a1a1a
--text-muted:  #6c757d
```

---

## 4. Tipografi

| Fungsi | Font | Fallback | Modul |
|--------|------|----------|-------|
| **Teks Arab** | Amiri | Traditional Arabic, serif | Quran, Doa, Dashboard |
| **Teks Rumi / UI** | DM Sans | system-ui, sans-serif | Dashboard, Doa, Kewangan |
| **Terjemahan Quran** | Courier New | monospace | Quran |
| **UI Waktu Solat** | Nunito Sans | system-ui, sans-serif | Waktu Solat |

Semua font dimuat secara **lokal** (Quran) atau **CDN dengan fallback system font** (Dashboard, Doa, Waktu Solat, Kewangan).

### Saiz Font Asas

| Elemen | Saiz | Modul |
|--------|------|-------|
| Ayat Arab | 20-24px | Quran, Doa, Dashboard |
| Terjemahan | 13-14px | Semua |
| Tajuk widget | 11px (uppercase) | Dashboard |
| Masa solat | 22px | Dashboard, Waktu Solat |
| Butang nav | 11-12px | Semua |

---

## 5. Komponen Kongsi

### Card

```
background: var(--bg-card) / var(--color-background-secondary)
border: 0.5-1px solid var(--border) / var(--color-border-tertiary)
border-radius: 12px (--radius / --border-radius-md)
padding: 14-18px
shadow: 0 1px 3px rgba(0,0,0,0.06)
```

### Butang Nav

```
background: none
border: none
color: var(--text-muted) / var(--color-text-secondary)
padding: 6px 12px
border-radius: 6-8px
.active: color: var(--gold) / var(--gold-light)
```

### Ikon

Semua ikon adalah **SVG inline** (tiada library ikon). Saiz:
- Nav bar: 20-22px
- Sidebar: 16px
- Widget kecil: 10-14px

### Modal / Sheet

```
.backdrop:        rgba(0,0,0,0.4), fixed inset
.sheet:           white, border-radius 12px top, max-width 480px
padding:          16-20px
```

---

## 6. Layout

### Dashboard (index.html)

```
Max-width: 480px (mobile-first)
Pusat: auto margin
Section: padding 14-20px, border-bottom separator
Background: #fbfaf6 (krim)
```

### Modul Khas

| Modul | Layout Lebar | Orientasi |
|-------|-------------|-----------|
| Quran | 700px max, centered | Portrait utama |
| Waktu Solat | 600px max, centered | Portrait + Landscape (responsive) |
| Doa | Fluid (sidebar 270px + main flex) | Portrait utama |
| Kewangan | Fluid, max 720px | Portrait + Landscape |

---

## 7. Responsive

| Breakpoint | Perubahan |
|------------|-----------|
| **< 768px** | Sidebar jadi overlay (slide from left), bottom nav muncul, padding kurangkan |
| **< 400px** | Font lebih kecil, grid 2-kolum → 1-kolum |
| **Landscape < 500px tinggi** | Layout padat, elemen tidak kritikal disembunyi |
| **≥ 769px** | Sidebar kekal (desktop), bottom nav hilang |

### Safe Area

```css
padding: env(safe-area-inset-top) env(safe-area-inset-right) 
         env(safe-area-inset-bottom) env(safe-area-inset-left);
```

Notched devices (iPhone, Android) — konten tidak tersorok oleh rounded corners atau home indicator.

---

## 8. Komponen Spesifik Modul

### Dashboard Widgets

| Widget | Tinggi | Tindakan |
|--------|--------|----------|
| Solat (current + countdown + grid) | ~160px | Auto update |
| Ayat hari ini | ~140px | Butang "↻ lain" |
| Doa hari ini | ~100px | Statik, random harian |
| Rutin harian | ~200px | 4 item, bullet pointer |
| Peringatan | ~80px | Random daily |

### Quran Module

- Flashcard: `border-radius: 14px`, padding `16-18px`, gap `12px`
- Teks Arab: RTL, `font-size: 21px`, `line-height: 1.9`
- Navigation: Butang `‹` `›`, butang "Selesai Baca"
- Controls: Collapsible bar, surah picker dengan juz filter

### Waktu Solat Module

- Spinner: Butang ↑↓ tanpa dropdown
- Grid solat: 4 kolum (mobile: 2 kolum)
- Countdown: Font monospace besar (2.5rem), emas glow
- Background: Gradient dinamik ikut 5 waktu (subuh, siang, asar, malam, malam dalam)

### Doa Module

- Sidebar: 270px, dark (#1a1a2e), gold text
- Collections: List item dengan icon + count badge
- Detail: Arabic (Amiri, RTL, 1.35rem) + translation + source + actions (❤️, 📤)
- Search: Input full width, real-time filter

### Kewangan Module

- Tab: Horizontal tab bar, underline active
- Summary: 3 metric cards (masuk, keluar, baki)
- Entry table: Clean table dengan category pill
- Invest: Grid card dengan progress bar + gain/loss indicator
- Zakat: Warning box dengan auto-kalkulasi

---

## 9. Animasi & Transisi

| Elemen | Animasi | Duration | Modul |
|--------|---------|----------|-------|
| Sidebar open/close | Slide translateX | 0.25s ease | Doa |
| Page switch | Instant (show/hide) | — | Dashboard |
| Quran slide/page | anime.js slideOut+slideIn | 260ms easeOutCubic | Quran |
| Card hover | Scale / border-color | 0.15-0.2s ease | Semua |
| Countdown tick | Text update | 1s | Waktu Solat |
| Background solat | Gradient transition | 2s ease | Waktu Solat |
| Modal backdrop | Fade in | 0.2s | Doa, Dashboard |
| FAB hover | Scale 1.12 | 0.25s | Waktu Solat |
| Theme swatch hover | Scale 1.18 | 0.2s | Waktu Solat |

## 9a. Sistem Responsif Auto-Adapt

Semua sub-sistem menggunakan **`shared-responsive.css`** sebagai satu sumber kebenaran responsive.

### Prinsip Responsif

1. **Mobile-first** — reka bentuk bermula dari skrin terkecil (360px), kemudian diperluas
2. **Orientation-aware** — layout berubah ikut portrait/landscape, bukan hanya lebar
3. **Height-aware** — skrin pendek (landskap telefon) dapat layout mampat khas
4. **Safe area** — semua padding guna `env(safe-area-*)` untuk notched devices
5. **Fluid typography** — saiz teks guna `clamp()` — mengecut/membesar secara semula jadi
6. **Container queries** — komponen dalaman adaptif ikut parent size, bukan viewport

### Breakpoints Visual

| Saiz | Nama | Perubahan Layout |
|------|------|-----------------|
| ≤ 360px | **XS** | Grid 2-kolom, padding minimum, teks kecil |
| 361–480px | **SM** | Dashboard 480px maks, grid 3-kolom |
| 481–639px | **MD** | Arabic font full size, grid normal |
| 640–1023px | **LG** | Tablet potret — padding luas, single-column selesa |
| 1024–1279px | **XL** | Desktop — layout penuh, sidebar stabil |
| ≥ 1280px | **XXL** | Container max-width diperluas |

### Orientation Khas

**Landscape pada skrin kecil** (≤ 520px tinggi):
- Header & footer dimampatkan
- Kandungan memenuhi skrin penuh
- Sistem-doa sidebar jadi mini-bar (56px, icon sahaja)
- Waktu solat grid gap dikecilkan

**Potret pada tablet** (600–1024px lebar):
- Single-column yang selesa
- Font dan spacing diperbesar untuk readability jarak jauh
- Hero diperluas

### Teknik Pelaksanaan

| Teknik | CSS/JS | Lokasi |
|--------|--------|--------|
| CSS Custom Properties | `--bp-*`, `--safe-*`, `--vh` | `shared-responsive.css` |
| Media queries | `@media (width)`, `(orientation)`, `(height)` | `shared-responsive.css` + sub-sistem CSS |
| Container queries | `@container` | Komponen dalaman |
| Fluid typography | `clamp()`, `min()`, `max()` | `shared-responsive.css` |
| Viewport fix | `--vh: 1vh` → dynamic via JS | `shared-responsive.js` |
| Orientation watcher | `data-orientation` attribute | `shared-responsive.js` |
| Screen classifier | `data-screen` attribute (xs–xxl) | `shared-responsive.js` |
| Safe area | `env(safe-area-inset-*)` | `shared-responsive.css` |

---

## 10. Garis Panduan Modul Baru

Setiap modul baru MESTI:

1. **Guna palet sendiri** — tak perlu ikut warna modul lain, cuma guna nilai yang sesuai dengan mood modul
2. **Font sendiri** — bebas pilih Google Fonts asalkan ada fallback system
3. **Card-style yang sama** — border-radius 8-14px, padding 14-18px, border 0.5-1px solid
4. **Safe area insets** — `env(safe-area-inset-*)` untuk notched devices
5. **Offline dulu** — baru online. Data embed > fetch API
6. **Responsive** — 360px hingga desktop — **WAJIB paut** `shared-responsive.css` + `shared-responsive.js`
7. **Navigasi kembali ke hub** — butang "← Hub" atau nama app yang klik ke index.html
8. **Orientation-aware** — layout mesti diuji dalam portrait dan landscape

---

*Dokumen ini adalah sumber kebenaran reka bentuk visual untuk semua modul.*
*Rujuk SKILL.md untuk seni bina modular dan PROTOCOL.md untuk disiplin kod.*
