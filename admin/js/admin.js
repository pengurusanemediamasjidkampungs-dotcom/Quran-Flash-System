/* ─── Admin Panel JS ─── */
(function() {
  var TOKEN_KEY = 'quran_admin_token';
  var API = window.location.origin + '/api';

  /* ─── State ─── */
  var state = {
    token: sessionStorage.getItem(TOKEN_KEY) || '',
    page: 'dashboard',
    doa: [],
    kewangan: null,
  };

  /* ─── Helpers ─── */
  var $ = function(id) { return document.getElementById(id); };

  function esc(s) { return String(s).replace(/[&<>"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  async function api(path, opts) {
    opts = opts || {};
    var headers = { 'Content-Type': 'application/json' };
    if (state.token) headers['x-admin-token'] = state.token;
    try {
      var r = await fetch(API + path, { headers: headers, ...opts });
      if (r.status === 401) { logout(); return null; }
      return await r.json();
    } catch (e) {
      showToast('Ralat: ' + e.message, 'err');
      return null;
    }
  }

  function showToast(msg, type) {
    var el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast ' + (type || '') + ' show';
    clearTimeout(el._t);
    el._t = setTimeout(function() { el.classList.remove('show'); }, 2500);
  }

  /* ─── Auth ─── */
  function login(password) {
    fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password })
    }).then(function(r) { return r.json(); }).then(function(res) {
      if (res.success) {
        state.token = res.token;
        sessionStorage.setItem(TOKEN_KEY, res.token);
        showApp();
        loadAll();
      } else {
        $('login-error').textContent = res.message || 'Password salah';
        $('login-error').classList.add('show');
      }
    }).catch(function() {
      $('login-error').textContent = 'Ralat sambungan ke server';
      $('login-error').classList.add('show');
    });
  }

  function logout() {
    state.token = '';
    sessionStorage.removeItem(TOKEN_KEY);
    showLogin();
  }

  function showLogin() {
    $('login-page').style.display = 'flex';
    $('app').style.display = 'none';
  }

  function showApp() {
    $('login-page').style.display = 'none';
    $('app').style.display = 'flex';
  }

  /* ─── Navigation ─── */
  function switchPage(page) {
    state.page = page;
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    var target = $('section-' + page);
    if (target) target.classList.add('active');
    document.querySelectorAll('.sidebar-nav a').forEach(function(a) {
      a.classList.toggle('active', a.dataset.page === page);
    });
    $('page-title').textContent = document.querySelector('.sidebar-nav a.active')?.querySelector('span')?.textContent || 'Dashboard';
  }

  /* ─── Load All Data ─── */
  function loadAll() {
    loadStats();
    loadDoa();
    loadKewangan();
  }

  /* ─── Stats ─── */
  async function loadStats() {
    var stats = {};
    try {
      var list = await fetch('/data/surah_list.json').then(function(r) { return r.json(); });
      var totalAyat = 0;
      list.forEach(function(s) { totalAyat += s.versesCount; });
      stats.totalSurah = list.length;
      stats.totalAyat = totalAyat;
    } catch(e) { stats.totalSurah = 114; stats.totalAyat = 6236; }

    if (state.doa.length) {
      stats.totalDoa = state.doa.reduce(function(sum, c) { return sum + (c.count || 0); }, 0);
    }

    $('stat-surah').textContent = stats.totalSurah;
    $('stat-ayat').textContent = stats.totalAyat;
    $('stat-doa').textContent = stats.totalDoa || '—';
  }

  /* ─── DOA CRUD ─── */
  async function loadDoa() {
    var data = await api('/data/doa');
    if (data) {
      state.doa = data._items || [];
      renderDoaTable();
    }
  }

  function renderDoaTable() {
    var tbody = $('doa-body');
    if (!tbody) return;
    if (!state.doa.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Belum ada doa. Tambah doa baru.</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    state.doa.forEach(function(item, i) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + esc(item.collection || '-') + '</td>' +
        '<td style="font-family:Amiri,serif;font-size:1.1rem;direction:rtl">' + esc(item.arabic || '').slice(0, 60) + '</td>' +
        '<td>' + esc(item.translation || '').slice(0, 60) + '</td>' +
        '<td>' +
        '<button class="btn btn-sm btn-ghost" onclick="window._editDoa(' + i + ')">✎</button> ' +
        '<button class="btn btn-sm btn-danger" onclick="window._delDoa(' + i + ')">×</button>' +
        '</td>';
      tbody.appendChild(tr);
    });
  }

  window._delDoa = function(idx) {
    if (!confirm('Padam doa ini?')) return;
    state.doa.splice(idx, 1);
    api('/array/doa', {
      method: 'POST',
      body: JSON.stringify({ _replace: state.doa })
    });
    renderDoaTable();
    showToast('Doa dipadam', 'ok');
  };

  window._editDoa = function(idx) {
    var item = state.doa[idx];
    showDoaModal(item, idx);
  };

  function showDoaModal(item, idx) {
    item = item || { collection: '', arabic: '', translation: '', ref: '' };
    var modal = $('modal');
    var body = $('modal-body');
    var isNew = idx === undefined;
    body.innerHTML =
      '<div class="form-group"><label>Koleksi</label><input id="f-collection" value="' + esc(item.collection) + '"></div>' +
      '<div class="form-group"><label>Arab (teks doa)</label><textarea id="f-arabic" rows="3" dir="rtl">' + esc(item.arabic) + '</textarea></div>' +
      '<div class="form-group"><label>Terjemahan</label><textarea id="f-translation" rows="2">' + esc(item.translation) + '</textarea></div>' +
      '<div class="form-group"><label>Rujukan</label><input id="f-ref" value="' + esc(item.ref || '') + '"></div>';
    $('modal-title').textContent = isNew ? 'Tambah Doa' : 'Edit Doa';
    $('modal-save').onclick = function() {
      var data = {
        collection: $('f-collection').value.trim(),
        arabic: $('f-arabic').value.trim(),
        translation: $('f-translation').value.trim(),
        ref: $('f-ref').value.trim(),
      };
      if (isNew) {
        state.doa.push(data);
      } else {
        state.doa[idx] = data;
      }
      api('/array/doa', { method: 'POST', body: JSON.stringify({ _replace: state.doa }) });
      renderDoaTable();
      modal.classList.remove('open');
      showToast(isNew ? 'Doa ditambah' : 'Doa dikemas kini', 'ok');
    };
    modal.classList.add('open');
  }

  window._addDoa = function() { showDoaModal(undefined, undefined); };

  /* ─── Kewangan CRUD ─── */
  async function loadKewangan() {
    var data = await api('/data/kewangan');
    if (data) {
      state.kewangan = data;
      renderKewangan();
    }
  }

  function renderKewangan() {
    ['income','bills','invest'].forEach(function(section) {
      var tbody = $('kw-' + section + '-body');
      if (!tbody) return;
      var items = state.kewangan[section] || [];
      if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Tiada data</td></tr>';
        return;
      }
      tbody.innerHTML = '';
      items.forEach(function(item, i) {
        var tr = document.createElement('tr');
        var fields = section === 'invest'
          ? '<td>' + esc(item.type||'') + '</td><td>' + esc(item.name||'') + '</td><td>' + (item.unit||0) + '</td>'
          : '<td>' + esc(item.cat||'') + '</td><td>' + esc(item.desc||'') + '</td><td>RM ' + (item.amt||0) + '</td>';
        tr.innerHTML = fields + '<td><button class="btn btn-sm btn-danger" onclick="window._delKewangan(\'' + section + '\',' + i + ')">×</button></td>';
        tbody.appendChild(tr);
      });
    });
  }

  window._delKewangan = function(section, idx) {
    if (!confirm('Padam item ini?')) return;
    state.kewangan[section].splice(idx, 1);
    api('/data/kewangan/kewangan', { method: 'PUT', body: JSON.stringify(state.kewangan) });
    renderKewangan();
    showToast('Item dipadam', 'ok');
  };

  /* ─── Modal Close ─── */
  document.addEventListener('click', function(e) {
    var modal = $('modal');
    if (e.target === modal) modal.classList.remove('open');
  });
  $('modal-close')?.addEventListener('click', function() { $('modal').classList.remove('open'); });

  /* ─── Init ─── */
  function init() {
    if (state.token) {
      showApp();
      loadAll();
    } else {
      showLogin();
    }

    $('login-btn')?.addEventListener('click', function() {
      login($('login-password').value);
    });
    $('login-password')?.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') login(this.value);
    });

    document.querySelectorAll('.sidebar-nav a').forEach(function(a) {
      a.addEventListener('click', function() { switchPage(a.dataset.page); });
    });

    $('logout-btn')?.addEventListener('click', logout);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
