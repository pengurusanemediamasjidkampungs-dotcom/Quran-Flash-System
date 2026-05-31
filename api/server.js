import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const ADMIN_DIR = join(__dirname, '..', 'admin');
const FRONTEND_DIR = join(__dirname, '..', 'frontend');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

/* ─── JSON Store Helper ─── */
const stores = {};

function getStorePath(name) {
  return join(DATA_DIR, `${name}.json`);
}

function loadStore(name) {
  const p = getStorePath(name);
  if (stores[name]) return stores[name];
  if (existsSync(p)) {
    try {
      stores[name] = JSON.parse(readFileSync(p, 'utf-8'));
      return stores[name];
    } catch (e) {
      stores[name] = {};
    }
  } else {
    stores[name] = {};
  }
  return stores[name];
}

function saveStore(name) {
  const p = getStorePath(name);
  writeFileSync(p, JSON.stringify(stores[name], null, 2));
}

/* ─── Auth Middleware ─── */
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token === process.env.ADMIN_SECRET) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

/* ─── Auth Routes ─── */
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_SECRET) {
    return res.json({ success: true, token: password });
  }
  res.status(401).json({ success: false, message: 'Password salah' });
});

/* ─── Data CRUD Routes ─── */
app.get('/api/data/:store', (req, res) => {
  const data = loadStore(req.params.store);
  res.json(data);
});

app.get('/api/data/:store/:key', (req, res) => {
  const data = loadStore(req.params.store);
  res.json(data[req.params.key] || null);
});

app.post('/api/data/:store/:key', requireAdmin, (req, res) => {
  const store = loadStore(req.params.store);
  store[req.params.key] = req.body;
  saveStore(req.params.store);
  res.json({ success: true });
});

app.put('/api/data/:store/:key', requireAdmin, (req, res) => {
  const store = loadStore(req.params.store);
  store[req.params.key] = req.body;
  saveStore(req.params.store);
  res.json({ success: true });
});

app.delete('/api/data/:store/:key', requireAdmin, (req, res) => {
  const store = loadStore(req.params.store);
  delete store[req.params.key];
  saveStore(req.params.store);
  res.json({ success: true });
});

/* ─── Array CRUD (for ordered lists) ─── */
app.get('/api/array/:store', (req, res) => {
  const store = loadStore(req.params.store);
  res.json(store._items || []);
});

app.post('/api/array/:store', requireAdmin, (req, res) => {
  const store = loadStore(req.params.store);
  if (!store._items) store._items = [];
  store._items.push(req.body);
  saveStore(req.params.store);
  res.json({ success: true, index: store._items.length - 1 });
});

app.put('/api/array/:store/:index', requireAdmin, (req, res) => {
  const store = loadStore(req.params.store);
  if (!store._items) store._items = [];
  const idx = parseInt(req.params.index);
  if (idx >= 0 && idx < store._items.length) {
    store._items[idx] = { ...store._items[idx], ...req.body };
    saveStore(req.params.store);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/array/:store/:index', requireAdmin, (req, res) => {
  const store = loadStore(req.params.store);
  if (!store._items) store._items = [];
  const idx = parseInt(req.params.index);
  if (idx >= 0 && idx < store._items.length) {
    store._items.splice(idx, 1);
    saveStore(req.params.store);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

/* ─── Quran Data Routes ─── */
app.get('/api/quran/surah-list', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(join(DATA_DIR, 'surah_list.json'), 'utf-8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load surah list' });
  }
});

app.get('/api/quran/surah/:id', (req, res) => {
  try {
    const id = String(req.params.id).padStart(3, '0');
    const data = JSON.parse(readFileSync(join(DATA_DIR, `${id}.json`), 'utf-8'));
    res.json(data);
  } catch (e) {
    res.status(404).json({ error: 'Surah not found' });
  }
});

/* ─── Static Files (Admin & Frontend) ─── */
app.use('/admin', express.static(ADMIN_DIR));
app.use('/frontend', express.static(FRONTEND_DIR));
app.use('/data', express.static(DATA_DIR));
app.use('/sw.js', express.static(join(__dirname, '..', 'sw.js')));

/* ─── Serve root files ─── */
app.use(express.static(join(__dirname, '..')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Quran Flash API running on http://localhost:${PORT}`);
});
