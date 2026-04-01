const express = require('express');
const { getDb } = require('./db');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST /api/register — Enregistre un buddy
app.post('/api/register', (req, res) => {
  const { handle, species, rarity, eye, hat, shiny, stats, github } = req.body;

  if (!handle || !species || !rarity) {
    return res.status(400).json({ error: 'handle, species et rarity sont requis' });
  }

  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO buddies (handle, species, rarity, eye, hat, shiny, stats, github)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(handle) DO UPDATE SET
      species = excluded.species,
      rarity = excluded.rarity,
      eye = excluded.eye,
      hat = excluded.hat,
      shiny = excluded.shiny,
      stats = excluded.stats,
      github = excluded.github,
      registered_at = CURRENT_TIMESTAMP
  `);

  stmt.run(handle, species, rarity, eye || null, hat || null, shiny ? 1 : 0, JSON.stringify(stats || {}), github || null);
  res.json({ ok: true, handle });
});

// GET /api/buddy/:handle — Récupère un buddy par handle
app.get('/api/buddy/:handle', (req, res) => {
  const db = getDb();
  const buddy = db.prepare('SELECT * FROM buddies WHERE handle = ?').get(req.params.handle);

  if (!buddy) {
    return res.status(404).json({ error: 'Buddy non trouvé' });
  }

  buddy.stats = JSON.parse(buddy.stats || '{}');
  buddy.shiny = !!buddy.shiny;
  res.json(buddy);
});

// POST /api/ping — Envoie un ping (demande de collection)
app.post('/api/ping', (req, res) => {
  const { from_handle, to_handle } = req.body;

  if (!from_handle || !to_handle) {
    return res.status(400).json({ error: 'from_handle et to_handle sont requis' });
  }

  const db = getDb();

  const from = db.prepare('SELECT handle FROM buddies WHERE handle = ?').get(from_handle);
  const to = db.prepare('SELECT handle FROM buddies WHERE handle = ?').get(to_handle);

  if (!from) return res.status(404).json({ error: `Handle "${from_handle}" non enregistré` });
  if (!to) return res.status(404).json({ error: `Handle "${to_handle}" non enregistré` });

  const stmt = db.prepare('INSERT INTO pings (from_handle, to_handle) VALUES (?, ?)');
  const result = stmt.run(from_handle, to_handle);

  const buddy = db.prepare('SELECT * FROM buddies WHERE handle = ?').get(to_handle);
  buddy.stats = JSON.parse(buddy.stats || '{}');
  buddy.shiny = !!buddy.shiny;

  res.json({ ok: true, pingId: result.lastInsertRowid, buddy });
});

// GET /api/search — Recherche de buddies
app.get('/api/search', (req, res) => {
  const { species, rarity, shiny } = req.query;
  const db = getDb();

  let query = 'SELECT * FROM buddies WHERE 1=1';
  const params = [];

  if (species) {
    query += ' AND species = ?';
    params.push(species);
  }
  if (rarity) {
    query += ' AND rarity = ?';
    params.push(rarity);
  }
  if (shiny !== undefined) {
    query += ' AND shiny = ?';
    params.push(shiny === 'true' ? 1 : 0);
  }

  query += ' ORDER BY registered_at DESC LIMIT 50';

  const buddies = db.prepare(query).all(...params);
  buddies.forEach(b => {
    b.stats = JSON.parse(b.stats || '{}');
    b.shiny = !!b.shiny;
  });

  res.json(buddies);
});

// GET /api/leaderboard — Top buddies
app.get('/api/leaderboard', (req, res) => {
  const db = getDb();

  const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
  const buddies = db.prepare('SELECT * FROM buddies ORDER BY registered_at DESC').all();

  buddies.forEach(b => {
    b.stats = JSON.parse(b.stats || '{}');
    b.shiny = !!b.shiny;
  });

  buddies.sort((a, b) => {
    const ra = rarityOrder[a.rarity] || 0;
    const rb = rarityOrder[b.rarity] || 0;
    if (rb !== ra) return rb - ra;
    const totalA = Object.values(a.stats).reduce((s, v) => s + v, 0);
    const totalB = Object.values(b.stats).reduce((s, v) => s + v, 0);
    return totalB - totalA;
  });

  res.json(buddies.slice(0, 20));
});

app.listen(PORT, () => {
  console.log(`Claudex server running on http://localhost:${PORT}`);
});
