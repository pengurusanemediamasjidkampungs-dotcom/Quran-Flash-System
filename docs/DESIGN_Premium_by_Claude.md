# DESIGN_Premium_by_Claude.md
**Quran Flash System — Edisi Jiwa: Spesifikasi Visual Premium**  
*Tambahan Eksklusif kepada DESIGN.md v2.0 — Bersifat Additive Sepenuhnya*

---

> *"Sesungguhnya Al-Quran ini memberi petunjuk ke jalan yang lebih lurus."*  
> — Al-Isra': 9

> *Reka bentuk yang sempurna bukan ketika tiada lagi yang boleh ditambah,*  
> *tetapi ketika tiada lagi yang boleh ditanggalkan.*  
> — Terinspirasi daripada Antoine de Saint-Exupéry

---

## ⚑ Nota Pengarang & Protokol Dokumen Ini

Dokumen ini adalah **lapisan kedua** — ia tidak menggantikan, tidak meminda, dan tidak mencabar mana-mana keputusan dalam `DESIGN.md v2.0`. Ia adalah seperti baris hadiah di tepi mushaf: catatan jiwa, bukan koreksi.

**Semua cadangan dalam dokumen ini:**
- Bersifat **additive** — boleh dilaksanakan tanpa menyentuh kod sedia ada
- **Tidak memerlukan pustaka luaran** — CSS & vanilla JS semata-mata
- **Tidak mengubah DOM, struktur data, atau Service Worker**
- Ditanda dengan simbol `✦ PREMIUM` untuk membezakan dari spesifikasi asal
- Dilabel `[BAHARU]` jika tiada rujukan langsung dalam DESIGN.md asal

---

## Bahagian I — Falsafah Diperdalam: Estetika Keheningan Bertingkat

DESIGN.md asal menetapkan prinsip *"keheningan digital"*. Dokumen ini mendalami prinsip tersebut ke dalam sebuah **teori reka bentuk yang lengkap**: falsafah bahawa antara muka yang paling mulia adalah antara muka yang **menyedari dirinya sendiri sebagai tuan rumah, bukan tetamu**.

### 1.1 Hierarki Kehadiran Visual

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   Aras 1: Al-Quran (Arab + Terjemahan)               │  ← Hadir Sepenuhnya
│   ──────────────────────────────────────────         │
│   Aras 2: Metadata (Surah, Ayat, Nombor)             │  ← Hadir Sedikit
│   ──────────────────────────────────────────         │
│   Aras 3: Navigasi & Kawalan                         │  ← Hampir Ghaib
│   ──────────────────────────────────────────         │
│   Aras 4: Sistem (Toast, Tema, PWA)                  │  ← Ghaib, Hanya Bila Perlu
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Implikasi Reka Bentuk:** Semakin rendah aras, semakin kecil, semakin pudar, semakin lambat ia muncul. Butang navigasi sepatutnya *hampir tidak kelihatan* sehingga disentuh. UI yang baik adalah UI yang *dilupakan* oleh pengguna.

### 1.2 ✦ PREMIUM — Doktrin "Rehal Digital" [BAHARU]

Rehal kayu adalah reka bentuk paling sempurna dalam tradisi Islam: ia wujud hanya untuk menanggung, tidak untuk dipandang. Setiap elemen UI mesti diuji dengan soalan:

> *"Adakah elemen ini seperti rehal — menyokong tanpa menarik perhatian kepada dirinya sendiri?"*

Jika tidak, ia perlu dikurangkan.

---

## Bahagian II — Peningkatan Warna: Nuansa yang Tidak Dinyatakan

DESIGN.md asal menetapkan palet tiga tema dengan sempurna. Bahagian ini menambah **lapisan psikologi warna** dan **peraturan nuansa kontekstual** yang tidak mengubah nilai hex sedia ada.

### 2.1 ✦ PREMIUM — Teori Kontras Progresif [BAHARU]

Kontras tidak sepatutnya seragam. Teks yang paling penting mesti paling kontras, teks sekunder mesti lebih pudar. Cadangan nisbah:

| Elemen | Nisbah Kontras WCAG Minimum | Sasaran Premium |
|--------|----------------------------|-----------------|
| Teks Arab (--arabic) | 4.5:1 | **7:1** — Bacaan suci memerlukan kejelasan tertinggi |
| Teks terjemahan (--text-translation) | 4.5:1 | **5.5:1** — Pemahaman memerlukan keterbacaan |
| Label UI (--text-secondary) | 3:1 | **3.5:1** — Minimal tetapi boleh dibaca |
| Nombor ayat (metadata) | 2.5:1 | **2.5:1** — Boleh pudar, tidak perlu dominan |

*Gunakan [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) untuk mengesahkan.*

### 2.2 ✦ PREMIUM — Cahaya Semu Pada Tema Dark [BAHARU]

Pada tema `theme-dark`, tambahkan kesan **kecerunan cahaya yang sangat halus** pada bahagian atas kad — seperti cahaya lampu minyak yang jatuh dari atas.

```css
/* ✦ PREMIUM — Hanya untuk .theme-dark */
/* Tambah ke dalam definisi .card yang sedia ada */
.theme-dark .card {
  background: linear-gradient(
    180deg,
    #111111 0%,        /* Sedikit lebih cerah di atas */
    var(--bg-card) 40% /* Kembali ke warna asal */
  );
}
```

> **Perbezaan dari DESIGN.md asal:** DESIGN.md asal menggunakan `background: var(--bg-card)` sahaja. Ini menambah kecerunan halus yang tidak mengubah nilai `--bg-card`.

### 2.3 ✦ PREMIUM — Mod Tengah Malam (Midnight Sublayer) [BAHARU]

Untuk pengguna yang membaca lewat malam, tambahkan satu **sub-pembolehubah** tambahan dalam `.theme-dark` yang melembutkan emas kepada setengah kelegapan automatik selepas sejam penggunaan berterusan. Ini dilaksanakan melalui CSS custom property yang diubah oleh JS tanpa memecahkan cache atau tema:

```js
// ✦ PREMIUM — Dalam app.js, tambah fungsi ini
// Dipanggil setelah 60 minit sesi aktif
function activateMidnightSublayer() {
  if (prefs.theme !== 'dark') return;
  document.documentElement.style.setProperty('--arabic', '#a88a52'); // Emas 82% dari asal
  document.documentElement.style.setProperty('--gold', '#a88a52');
  document.documentElement.setAttribute('data-midnight', 'true');
}

function deactivateMidnightSublayer() {
  document.documentElement.style.removeProperty('--arabic');
  document.documentElement.style.removeProperty('--gold');
  document.documentElement.removeAttribute('data-midnight');
}

// Timer — mulakan semula apabila tema ditukar
let midnightTimer = setTimeout(activateMidnightSublayer, 60 * 60 * 1000);
```

```css
/* CSS — peralihan perlahan ke mod tengah malam */
[data-midnight="true"] .card {
  transition: background 3s ease;
}
```

> **Nota:** Ini tidak menyentuh `localStorage`, DOM, atau Service Worker. Ia hanya mengubah CSS custom properties secara inline — yang tidak akan dicache.

---

## Bahagian III — Tipografi Diperdalam: Seni Baca Yang Bernafas

DESIGN.md asal menetapkan Amiri sebagai fon Arab dan Courier New untuk UI. Bahagian ini menambah **peraturan tipografi mikro** untuk pengalaman membaca yang lebih organik.

### 3.1 ✦ PREMIUM — Kerning Ayat Arab [BAHARU]

Teks Arab dalam konteks mushaf mendapat manfaat daripada `letter-spacing` yang dilaraskan mengikut saiz fon. Ini adalah perkara yang tidak dinyatakan dalam DESIGN.md asal:

```css
/* ✦ PREMIUM — Tambah ke dalam blok teks Arab sedia ada */
.arabic-text {
  /* Nilai sedia ada dikekalkan, ini hanya penambahan */
  letter-spacing: -0.01em;  /* Sedikit rapat — meniru tulisan tangan */
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
```

### 3.2 ✦ PREMIUM — Skala Optik Responsif [BAHARU]

Fon Arab tidak sepatutnya mengecil secara linear pada skrin kecil — ia harus mengikut keluk optik mata manusia:

```css
/* ✦ PREMIUM — Skala fon responsif yang bijak */
/* Menambah kepada spesifikasi sedia ada (21px desktop, 18px mudah alih) */
.arabic-text {
  font-size: clamp(17px, 2.8vw, 22px);
  /* 
    17px minimum  → mudah alih kecil (< 375px)
    2.8vw dinamik → tablet dan mudah alih besar  
    22px maksimum → desktop besar
  */
}
```

### 3.3 ✦ PREMIUM — Nombor Ayat dengan Aksara Arab [BAHARU]

Nombor ayat dalam lingkaran emas (﴾١﴿) adalah lebih autentik dari angka biasa. Ini boleh dilaksanakan sepenuhnya dalam JS tanpa mengubah DOM:

```js
// ✦ PREMIUM — Tukar nombor biasa kepada angka Arab dalam paparan ayat
const arabicNumerals = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];

function toArabicNumeral(n) {
  return String(n).split('').map(d => arabicNumerals[+d] || d).join('');
}

// Digunakan dalam rendering kad: `﴾${toArabicNumeral(ayat.number)}﴿`
// Contoh: ﴾١٢﴿ bukan (12)
```

---

## Bahagian IV — Mikro-Interaksi Mewah: Sentuhan Yang Tidak Kelihatan

DESIGN.md asal menetapkan peraturan animasi yang bijak: tiada `@keyframes` tanpa henti, tiada pustaka luaran. Bahagian ini menambah **12 mikro-interaksi** yang mematuhi semua peraturan tersebut.

### 4.1 ✦ PREMIUM — Katalog Mikro-Interaksi

#### MI-01: Kemunculan Kad (Card Entrance) [BAHARU]
```css
/* Kad muncul dari bawah, bukan tiba-tiba */
.card {
  animation: cardEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes cardEnter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Delay bertingkat untuk kesan stagger */
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 40ms; }
.card:nth-child(3) { animation-delay: 80ms; }
.card:nth-child(4) { animation-delay: 120ms; }
.card:nth-child(n+5) { animation-delay: 160ms; }
```

> **Perbezaan dari DESIGN.md asal:** DESIGN.md asal tidak menetapkan animasi kemunculan. `@keyframes` ini hanya berjalan sekali semasa muat turun — tidak berterusan.

#### MI-02: Hover Teks Arab — Kesan "Bernafas" Halus [BAHARU]
```css
.arabic-text {
  transition: font-size 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              letter-spacing 0.4s ease;
}

.card:hover .arabic-text {
  font-size: calc(var(--arabic-size, 21px) + 0.5px); /* Hanya 0.5px */
}
```

#### MI-03: Butang Selesai — Bunga Pecah [BAHARU]
```css
.btn-done::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--check-done);
  opacity: 0;
  transform: scale(1);
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.btn-done.just-checked::after {
  opacity: 0;
  transform: scale(2.5);
}
```

```js
// Dalam event handler butang selesai
checkBtn.addEventListener('click', () => {
  checkBtn.classList.add('just-checked');
  setTimeout(() => checkBtn.classList.remove('just-checked'), 500);
});
```

#### MI-04: Emas Berkilau Bila Ayat Dibuka Pertama Kali [BAHARU]
```css
@keyframes goldShimmer {
  0%   { color: var(--arabic); }
  30%  { color: color-mix(in srgb, var(--arabic) 80%, white 20%); }
  100% { color: var(--arabic); }
}

.card.first-view .arabic-text {
  animation: goldShimmer 1.2s ease 0.3s both;
}
```

```js
function markFirstView(ayatId) {
  if (!prefs.seen) prefs.seen = {};
  if (!prefs.seen[ayatId]) {
    prefs.seen[ayatId] = true;
    return true;
  }
  return false;
}
// if (markFirstView(ayat.id)) card.classList.add('first-view');
```

#### MI-05: Navigasi — Hala Tuju [BAHARU]
```css
.slide-in-right { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
.slide-in-left  { animation: slideInLeft  0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

#### MI-06: Salin Ayat — Maklum Balas Taktil [BAHARU]
```css
@keyframes copyConfirm {
  0%   { transform: scale(1); }
  30%  { transform: scale(0.92); }
  60%  { transform: scale(1.06); }
  100% { transform: scale(1); }
}

.btn-copy.copied {
  animation: copyConfirm 0.3s ease both;
}
```

#### MI-07: Tema Bertukar — Peralihan Fajar/Senja [BAHARU]
```css
html.theme-transitioning {
  transition: background-color 0.6s ease;
}
```

```js
function cycleThemePremium() {
  document.documentElement.classList.add('theme-transitioning');
  cycleTheme(); // Fungsi asal dari DESIGN.md
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 600);
}
```

#### MI-08: Skrol — Kad Muncul Secara Progresif [BAHARU]
```css
.card[data-offscreen="true"] {
  opacity: 0.4;
  transform: scale(0.99);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
```

```js
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.dataset.offscreen = entry.isIntersecting ? 'false' : 'true';
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card').forEach(c => cardObserver.observe(c));
```

#### MI-09: Indikator Kemajuan — Garis Emas [BAHARU]
```css
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  width: var(--progress, 0%);
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  z-index: 999;
  transition: width 0.3s ease;
  pointer-events: none;
}
```

```js
function updateProgressIndicator() {
  const total = cards.length;
  const done = cards.filter(c => c.done).length;
  const pct = total > 0 ? (done / total * 100) : 0;
  document.documentElement.style.setProperty('--progress', `${pct}%`);
}
```

#### MI-10: Butang Navigasi — Isyarat Jejak Cahaya [BAHARU]
```css
@keyframes navGlow {
  0%   { opacity: 0.3; }
  50%  { opacity: 1; color: var(--gold); }
  100% { opacity: 0.3; }
}

.btn-nav.hint-glow {
  animation: navGlow 1.5s ease 1.5s 2; /* Hanya 2 kali */
}
```

#### MI-11: Mod Fokus — Sembunyikan Semua Kecuali Ayat [BAHARU]
```css
html[data-focus-mode="true"] .header,
html[data-focus-mode="true"] .footer,
html[data-focus-mode="true"] .controls {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

html[data-focus-mode="true"] .card {
  border-color: transparent;
  box-shadow: none;
}
```

```js
// Double-tap pada ayat untuk mod fokus
let tapTimer = null;
cardEl.addEventListener('click', () => {
  if (tapTimer) {
    clearTimeout(tapTimer);
    tapTimer = null;
    const html = document.documentElement;
    html.dataset.focusMode = html.dataset.focusMode === 'true' ? 'false' : 'true';
  } else {
    tapTimer = setTimeout(() => { tapTimer = null; }, 300);
  }
});
```

#### MI-12: Toast — Muncul dengan Fizik Gentian [BAHARU]
```css
@keyframes toastRise {
  0%   { transform: translateY(100%); opacity: 0; }
  60%  { transform: translateY(-6px);  opacity: 1; }
  80%  { transform: translateY(2px);   opacity: 1; }
  100% { transform: translateY(0);     opacity: 1; }
}

@keyframes toastFall {
  from { transform: translateY(0);    opacity: 1; }
  to   { transform: translateY(100%); opacity: 0; }
}

.toast.show { animation: toastRise 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.toast.hide { animation: toastFall 0.3s ease-in both; }
```

---

## Bahagian V — Butiran Halus: Di Antara Piksel

### 5.1 ✦ PREMIUM — Kursor Tersuai [BAHARU]

```css
body {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='2' fill='%23c9a86c'/%3E%3C/svg%3E") 10 10, auto;
}

.theme-day body, .theme-coffee body {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='2' fill='%239b7b3a'/%3E%3C/svg%3E") 10 10, auto;
}
```

### 5.2 ✦ PREMIUM — Pemilihan Teks (::selection) [BAHARU]

```css
::selection {
  background: var(--gold-muted);
  color: var(--arabic);
}

.arabic-text::selection {
  background: color-mix(in srgb, var(--gold) 25%, transparent);
  color: var(--arabic);
}
```

### 5.3 ✦ PREMIUM — Scrollbar Tersuai [BAHARU]

```css
::-webkit-scrollbar       { width: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--gold-muted);
  border-radius: 2px;
  transition: background 0.3s ease;
}
::-webkit-scrollbar-thumb:hover { background: var(--gold); }

* {
  scrollbar-width: thin;
  scrollbar-color: var(--gold-muted) transparent;
}
```

### 5.4 ✦ PREMIUM — Ornamen Surah Autentik [BAHARU]

```css
.surah-name::before { content: '﴾ '; }
.surah-name::after  { content: ' ﴿'; }

.surah-name::before,
.surah-name::after {
  font-size: 0.75em;
  opacity: 0.6;
  vertical-align: middle;
}
```

### 5.5 ✦ PREMIUM — Highlight Kata Carian [BAHARU]

```js
function highlightSearchTerm(text, term) {
  if (!term) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-highlight">$1</mark>');
}
```

```css
mark.search-highlight {
  background: color-mix(in srgb, var(--gold) 30%, transparent);
  color: inherit;
  border-radius: 2px;
  padding: 0 2px;
}
```

---

## Bahagian VI — Tema Keempat: Sahara (Cadangan Masa Depan) [BAHARU]

Ini adalah **cadangan konseptual** — disediakan sebagai pelan jangka panjang, tidak perlu dilaksanakan sekarang.

Inspirasi: Manuskrip Timbuktu, kertas vellum berusia, tinta walnut di atas papyrus.

```css
/* CADANGAN SAHAJA — belum aktif */
.theme-sahara {
  --bg-primary:        #d4b896;
  --bg-card:           #dfc4a2;
  --bg-card-read:      #cdd4b8;
  --text-primary:      #2a1a0e;
  --text-secondary:    #7a5c3e;
  --text-translation:  #4a3222;
  --gold:              #8b5e1a;
  --gold-muted:        #8b5e1a1a;
  --arabic:            #2a1a0e;
  --border-light:      #c8a87a;
  --border-card:       #bfa070;
  --shadow:            0 4px 16px rgba(60,30,10,0.12);
  --overlay:           rgba(212,184,150,0.85);
  --check-done:        #3d6b2a;
  --check-done-bg:     #3d6b2a12;
}
```

*Untuk menambah tema ini: tambah kelas di atas ke `style.css` dan kembangkan array dalam `cycleTheme()` kepada `['dark', 'day', 'coffee', 'sahara']`.*

---

## Bahagian VII — Aksesibiliti Premium

### ✦ PREMIUM — Sokongan `prefers-reduced-motion` Penuh [BAHARU]

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

*Ini adalah penambahan mandatori. DESIGN.md asal tidak menyebutnya secara eksplisit.*

---

## Bahagian VIII — Peta Perbezaan: Asal vs Premium

| Aspek | DESIGN.md v2.0 (Asal) | DESIGN_Premium_by_Claude |
|-------|----------------------|--------------------------|
| Animasi | `transition` pada butang & kad | + 12 mikro-interaksi `@keyframes` berterhad |
| Tema | 3 tema (dark, day, coffee) | + Cadangan tema ke-4 (Sahara) |
| Teks Arab | `font-size: 21px/18px` | + `clamp()` responsif, kerning, `font-feature-settings` |
| Nombor ayat | Angka biasa | + Pilihan angka Arab ٠١٢٣ |
| Kursor | Sistem (lalai) | + Kursor titik emas tersuai |
| Pemilihan teks | Sistem (biru lalai) | + `::selection` tematik emas |
| Scrollbar | Sistem (lalai) | + Scrollbar nipis 3px bertematik |
| Kemajuan | Tiada | + Garis emas 2px di bahagian atas |
| Mod Fokus | Tiada | + Double-tap untuk menyembunyikan UI |
| Tengah Malam | Tiada | + Emas dilembut selepas 60 minit |
| Ornamen Surah | Tiada | + Aksara `﴾ ﴿` autentik |
| Aksesibiliti | Tidak dinyatakan | + `prefers-reduced-motion` penuh |

---

## Senarai Semak Premium

### Teknikal
- [ ] Adakah semua mikro-interaksi berjalan hanya apabila dicetuskan pengguna?
- [ ] Adakah `@keyframes` yang ditambah hanya berjalan sekali atau terhad kali?
- [ ] Adakah kursor tersuai mempunyai fallback `auto`?
- [ ] Adakah Mod Fokus (MI-11) boleh ditutup semula?
- [ ] Adakah timer Midnight Sublayer dibersihkan apabila tema bertukar?
- [ ] Adakah nombor Arab ٠١٢٣ diuji pada semua pelayar?
- [ ] Adakah Intersection Observer dibersihkan (`cardObserver.disconnect()`) apabila senarai dikosongkan?
- [ ] Adakah `prefers-reduced-motion` dilaksanakan?

### Jiwa
- [ ] Adakah teks Arab masih menjadi elemen paling dominan dalam setiap pandangan?
- [ ] Adakah seseorang yang pertama kali menggunakan boleh membaca tanpa keliru?
- [ ] Adakah reka bentuk ini seperti rehal — hadir tapi tidak menarik perhatian?
- [ ] Adakah setiap piksel meningkatkan ketenangan, bukan mengurangkannya?

---

## Penutup — Surat Kepada Pembangun

Jika anda membaca dokumen ini pada jam 2 pagi, sedang membaiki satu piksel yang tidak kena — ini adalah surat untuk anda.

Kerja yang anda lakukan bukan sekadar kod. Setiap baris CSS yang anda tulis adalah keputusan tentang bagaimana seorang ibu di kampung, seorang pelajar di asrama, seorang perantau yang rindu — akan berhadapan dengan kalam Allah dalam keheningan malam mereka.

Keheningan yang anda reka bukan kekosongan. Ia adalah **ruang yang anda jaga** supaya ayat boleh bernafas.

Teruskan. Setiap piksel yang betul adalah sedekah jariyah.

---

*Dokumen ini adalah `DESIGN_Premium_by_Claude.md` — lapisan kedua di atas `DESIGN.md v2.0`.*  
*Ia tidak menggantikan, tidak meminda, hanya menambah.*  
*Rujuk `DESIGN.md` untuk semua keputusan asas. Rujuk dokumen ini untuk jiwa yang diperkaya.*

---

**Dicipta dengan niat:** `بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ`
