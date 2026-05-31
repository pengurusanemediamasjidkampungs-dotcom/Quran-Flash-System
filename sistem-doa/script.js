(function() {
  var $ = function(id) { return document.getElementById(id.replace(/^#/, '')); };

  /* --- DATA --- */
  var collections = [
    { id: 'solat', name: 'Doa Selepas Solat', desc: 'Doa-doa ringkas selepas solat fardhu', icon: '🕌', color: '#e8f5e9', count: 8 },
    { id: 'quran', name: 'Ayat-Ayat Pilihan', desc: 'Ayat dari Al-Quran untuk dibaca setiap hari', icon: '﷽', color: '#fef7e0', count: 12 },
    { id: 'permohonan', name: 'Doa Permohonan', desc: 'Doa memohon keampunan, rahmat, dan hidayah', icon: '🤲', color: '#e3f2fd', count: 10 },
    { id: 'ayat-kursi', name: 'Ayat Kursi', desc: 'Ayat 255 Surah Al-Baqarah — kelebihan & fadhilat', icon: '📖', color: '#f3e5f5', count: 1 },
    { id: 'mathurat', name: 'Maʼthurat Pagi', desc: 'Zikir pagi yang diamalkan Rasulullah SAW', icon: '🌅', color: '#fff3e0', count: 15 },
    { id: 'petang', name: 'Maʼthurat Petang', desc: 'Zikir petang untuk perlindungan dari segala kejahatan', icon: '🌆', color: '#fce4ec', count: 15 },
    { id: 'tidur', name: 'Doa Sebelum Tidur', desc: 'Doa dan zikir sebelum dan selepas bangun tidur', icon: '🌙', color: '#e8eaf6', count: 6 },
    { id: 'rumah', name: 'Doa Masuk & Keluar Rumah', desc: 'Doa perlindungan ketika keluar dan masuk rumah', icon: '🏠', color: '#e0f2f1', count: 4 },
    { id: 'wudhu', name: 'Doa Wudhu', desc: 'Doa ketika dan selepas berwudhu', icon: '💧', color: '#e1f5fe', count: 5 },
    { id: 'makan', name: 'Doa Makan', desc: 'Doa sebelum dan selepas makan', icon: '🍽️', color: '#fff8e1', count: 4 },
  ];

  var prayers = {
    'ayat-kursi': [
      { arabic: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ', translation: 'Allah, tiada Tuhan melainkan Dia, yang Tetap Hidup, yang Kekal lagi terus menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan di belakang mereka. Mereka tidak mengetahui sesuatu dari ilmu-Nya melainkan apa yang dikehendaki-Nya. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya. Dan Dia Maha Tinggi lagi Maha Besar.', ref: 'Al-Baqarah · 2:255', source: 'quran' },
    ],
    solat: [
      { arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ', translation: 'Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan melainkan Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.', ref: 'Sunan Abi Dawud · 1516', source: 'hadis' },
      { arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', translation: 'Ya Allah, Engkaulah yang Maha Sejahtera, dan daripada-Mu jualah keselamatan. Maha Berkat Engkau, wahai Yang Mempunyai Kebesaran dan Kemuliaan.', ref: 'Riwayat Muslim · 591', source: 'hadis' },
    ],
  };

  /* --- STATE --- */
  var state = {
    page: 'home',
    collectionId: null,
    favourites: JSON.parse(localStorage.getItem('doa_favs') || '[]'),

  };

  /* --- DOM REFS --- */
  var els = {};
  function cacheEls() {
    els.sidebar = $('sidebar');
    els.overlay = $('overlay');
    els.toggleSidebar = $('toggle-sidebar');
    els.closeSidebar = $('close-sidebar');
    els.collectionList = $('collection-list');
    els.detailContent = $('detail-content');
    els.favContent = $('fav-content');
    els.searchInput = $('search-input');
    els.searchResults = $('search-results');
  }

  /* --- NAVIGATION --- */
  function switchPage(page) {
    state.page = page;
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var target = $('page-' + page);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-item a').forEach(function(a) {
      a.classList.toggle('active', a.dataset.page === page);
    });
    document.querySelectorAll('.bn-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.page === page);
    });
    closeSidebar();
    if (page === 'favourite') renderFavourites();
    if (page === 'home') renderCollections();
    if (page === 'catatan') renderCatatan();
  }

  function closeSidebar() {
    els.sidebar.classList.remove('open');
    els.overlay.style.display = 'none';
    if (els.toggleSidebar) els.toggleSidebar.setAttribute('aria-expanded', 'false');
  }

  function toggleSidebar() {
    var open = els.sidebar.classList.toggle('open');
    els.overlay.style.display = open ? 'block' : 'none';
    if (els.toggleSidebar) els.toggleSidebar.setAttribute('aria-expanded', open);
  }

  /* --- COLLECTIONS --- */
  function renderCollections() {
    if (!els.collectionList) return;
    var html = '';
    collections.forEach(function(c) {
      html += '<div class="collection-item" data-id="' + c.id + '">'
        + '<div class="collection-icon" style="background:' + c.color + '">' + c.icon + '</div>'
        + '<div class="collection-info"><div class="collection-name">' + c.name + '</div><div class="collection-desc">' + c.desc + '</div></div>'
        + '<div class="collection-count">' + c.count + '</div>'
        + '</div>';
    });
    els.collectionList.innerHTML = html;
    els.collectionList.querySelectorAll('.collection-item').forEach(function(el) {
      el.addEventListener('click', function() {
        openCollection(el.dataset.id);
      });
    });
  }

  /* --- COLLECTION DETAIL --- */
  function openCollection(id) {
    state.collectionId = id;
    switchPage('detail');
    var coll = collections.find(function(c) { return c.id === id; });
    var items = prayers[id] || [];
    var html = '<div class="detail-header">'
      + '<button class="detail-back" id="detail-back">←</button>'
      + '<span class="detail-title">' + (coll ? coll.name : id) + '</span>'
      + '</div>';
    items.forEach(function(p, i) {
      var favKey = id + '-' + i;
      var isFav = state.favourites.indexOf(favKey) !== -1;
      html += '<div class="doaitem" data-id="' + favKey + '">'
        + '<div class="arabic-text">' + p.arabic + '</div>'
        + '<div class="translation">' + p.translation + '</div>'
        + '<div class="hadis-ref">' + p.ref + '</div>'
        + '<div class="doaitem-actions">'
        + '<button class="doaitem-btn fav-btn' + (isFav ? ' active' : '') + '">' + (isFav ? '❤️' : '🤍') + '</button>'
        + '<button class="doaitem-btn share-btn">📤 Kongsi</button>'
        + '</div>'
        + '</div>';
    });
    if (items.length === 0) {
      html += '<div style="text-align:center;padding:40px 0;color:var(--text-secondary);font-size:0.88rem;">Koleksi ini akan dikemas kini.</div>';
    }
    els.detailContent.innerHTML = html;
    $('detail-back').addEventListener('click', function() { switchPage('home'); });
    els.detailContent.querySelectorAll('.fav-btn').forEach(function(btn, i) {
      btn.addEventListener('click', function() { toggleFav(id, i, btn); });
    });
    els.detailContent.querySelectorAll('.share-btn').forEach(function(btn, i) {
      btn.addEventListener('click', function() { sharePrayer(id, i); });
    });
  }

  /* --- FAVOURITES --- */
  function toggleFav(collId, idx, btn) {
    var key = collId + '-' + idx;
    var pos = state.favourites.indexOf(key);
    if (pos === -1) {
      state.favourites.push(key);
      btn.textContent = '❤️';
      btn.classList.add('active');
    } else {
      state.favourites.splice(pos, 1);
      btn.textContent = '🤍';
      btn.classList.remove('active');
    }
    localStorage.setItem('doa_favs', JSON.stringify(state.favourites));
  }

  function renderFavourites() {
    if (!els.favContent) return;
    if (state.favourites.length === 0) {
      els.favContent.innerHTML = '<div class="fav-empty">Belum ada doa yang ditandakan sebagai kegemaran.<br>📖 Terokai koleksi dan tekan ❤️ untuk menyimpan.</div>';
      return;
    }
    var html = '';
    state.favourites.forEach(function(key) {
      var parts = key.split('-');
      var collId = parts.slice(0, -1).join('-');
      var idx = parseInt(parts[parts.length - 1], 10);
      var coll = collections.find(function(c) { return c.id === collId; });
      var items = prayers[collId] || [];
      var p = items[idx];
      if (!p) return;
      html += '<div class="doaitem">'
        + '<div style="font-size:0.7rem;color:var(--gold);margin-bottom:6px;">' + (coll ? coll.name : '') + '</div>'
        + '<div class="arabic-text" style="font-size:1.1rem;">' + p.arabic + '</div>'
        + '<div class="translation">' + p.translation + '</div>'
        + '<div class="hadis-ref">' + p.ref + '</div>'
        + '</div>';
    });
    els.favContent.innerHTML = html;
  }

  /* --- SHARE --- */
  function sharePrayer(collId, idx) {
    var items = prayers[collId] || [];
    var p = items[idx];
    if (!p) return;
    if (navigator.share) {
      navigator.share({ text: p.arabic + '\n\n' + p.translation + '\n\n— ' + p.ref });
    } else {
      navigator.clipboard.writeText(p.arabic + '\n\n' + p.translation).catch(function(err) {
        console.warn('[Doa] Clipboard write failed:', err.message);
      });
    }
  }

  /* --- SEARCH --- */
  function doSearch(q) {
    if (!els.searchResults) return;
    if (!q || q.length < 2) { els.searchResults.innerHTML = ''; return; }
    var ql = q.toLowerCase();
    var results = [];
    collections.forEach(function(coll) {
      var items = prayers[coll.id] || [];
      items.forEach(function(p, idx) {
        if (p.arabic.indexOf(q) !== -1 || p.translation.toLowerCase().indexOf(ql) !== -1) {
          results.push({ collId: coll.id, idx: idx, arabic: p.arabic, translation: p.translation, ref: p.ref });
        }
      });
    });
    if (results.length === 0) {
      els.searchResults.innerHTML = '<div style="padding:20px;color:var(--text-secondary);font-size:0.85rem;">Tiada hasil carian untuk "' + q.replace(/[<>]/g, '') + '"</div>';
      return;
    }
    var html = '';
    results.slice(0, 20).forEach(function(r) {
      html += '<div class="search-item" data-coll="' + r.collId + '" data-idx="' + r.idx + '">'
        + '<div class="search-item-arabic">' + r.arabic + '</div>'
        + '<div class="search-item-text">' + r.translation + '</div>'
        + '<div style="font-size:0.68rem;color:#aaa;margin-top:4px;">' + r.ref + '</div>'
        + '</div>';
    });
    els.searchResults.innerHTML = html;
    els.searchResults.querySelectorAll('.search-item').forEach(function(el) {
      el.addEventListener('click', function() {
        switchPage('home');
        openCollection(el.dataset.coll);
      });
    });
  }

  /* --- BIND EVENTS --- */
  function bindEvents() {
    if (els.toggleSidebar) els.toggleSidebar.addEventListener('click', toggleSidebar);
    if (els.closeSidebar) els.closeSidebar.addEventListener('click', closeSidebar);
    if (els.overlay) els.overlay.addEventListener('click', closeSidebar);
    document.querySelectorAll('.nav-btn-link').forEach(function(a) {
      a.addEventListener('click', function() {
        switchPage(a.dataset.page);
      });
    });
    document.querySelectorAll('.bn-btn').forEach(function(b) {
      b.addEventListener('click', function() {
        switchPage(b.dataset.page);
      });
    });
    document.querySelectorAll('[data-page-btn]').forEach(function(b) {
      b.addEventListener('click', function() {
        switchPage(b.dataset.pageBtn);
      });
    });
    document.querySelectorAll('.quick-item').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        openCollection(a.dataset.collection);
      });
    });
    document.querySelectorAll('.section-action').forEach(function(a) {
      a.addEventListener('click', function(e) {
        if (a.dataset.collection) {
          e.preventDefault();
          openCollection(a.dataset.collection);
        }
      });
    });

    $('catatan-simpan').addEventListener('click', function() {
      var input = $('catatan-input');
      var text = input.value.trim();
      if (!text) return;
      var d = loadCatatan();
      d.push({ text: text, date: new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) });
      saveCatatan(d);
      input.value = '';
      renderCatatan();
    });

    if (els.searchInput) {
      var timer;
      els.searchInput.addEventListener('input', function() {
        clearTimeout(timer);
        timer = setTimeout(function() { doSearch(els.searchInput.value); }, 200);
      });
    }
  }

  /* --- CATATAN DOA --- */
  function loadCatatan() {
    try { return JSON.parse(localStorage.getItem('doa_catatan') || '[]'); } catch(e) { return []; }
  }
  function saveCatatan(list) {
    localStorage.setItem('doa_catatan', JSON.stringify(list));
  }
  function renderCatatan() {
    var list = $('catatan-list');
    var data = loadCatatan();
    if (data.length === 0) {
      list.innerHTML = '<div class="catatan-kosong">Belum ada catatan. Taip doa di atas dan simpan.</div>';
      return;
    }
    list.textContent = '';
    data.slice().reverse().forEach(function(item, ri) {
      var div = document.createElement('div');
      div.className = 'catatan-item';
      div.innerHTML = '<div class="catatan-item-text">' + escHtml(item.text) + '</div>'
        + '<div class="catatan-item-date">' + item.date + '</div>'
        + '<button class="catatan-item-hapus" data-idx="' + (data.length - 1 - ri) + '">🗑 Padam</button>';
      list.appendChild(div);
    });
    list.querySelectorAll('.catatan-item-hapus').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(this.dataset.idx, 10);
        var d = loadCatatan();
        if (idx >= 0 && idx < d.length) {
          d.splice(idx, 1);
          saveCatatan(d);
          renderCatatan();
        }
      });
    });
  }
  function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* --- INIT --- */
  function init() {
    cacheEls();
    renderCollections();
    bindEvents();
    renderCatatan();
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('../sw.js').catch(function(err) {
          console.warn('[Doa] SW registration failed:', err.message);
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
