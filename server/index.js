const express = require('express');
const { getDb, getUniqueShareCode } = require('./db');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Normalise species/rarity to lowercase
function norm(s) { return (s || '').toLowerCase().trim(); }

// POST /api/register
app.post('/api/register', (req, res) => {
  const { handle, species, rarity, eye, hat, shiny, stats, github } = req.body;

  if (!handle || !species || !rarity) {
    return res.status(400).json({ error: 'handle, species et rarity sont requis' });
  }

  const db = getDb();

  // Check if already registered
  const existing = db.prepare('SELECT share_code FROM buddies WHERE handle = ?').get(handle);

  if (existing && existing.share_code) {
    // Update buddy data, keep same share code
    const stmt = db.prepare(`
      UPDATE buddies SET species=?, rarity=?, eye=?, hat=?, shiny=?, stats=?, github=?, registered_at=CURRENT_TIMESTAMP
      WHERE handle=?
    `);
    stmt.run(norm(species), norm(rarity), eye || null, hat || null, shiny ? 1 : 0, JSON.stringify(stats || {}), github || null, handle);
    res.json({ ok: true, handle, share_code: existing.share_code });
  } else {
    const share_code = getUniqueShareCode();
    const stmt = db.prepare(`
      INSERT INTO buddies (handle, share_code, species, rarity, eye, hat, shiny, stats, github)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(handle) DO UPDATE SET
        share_code = excluded.share_code,
        species = excluded.species,
        rarity = excluded.rarity,
        eye = excluded.eye,
        hat = excluded.hat,
        shiny = excluded.shiny,
        stats = excluded.stats,
        github = excluded.github,
        registered_at = CURRENT_TIMESTAMP
    `);
    stmt.run(handle, share_code, norm(species), norm(rarity), eye || null, hat || null, shiny ? 1 : 0, JSON.stringify(stats || {}), github || null);
    res.json({ ok: true, handle, share_code });
  }
});

// GET /api/buddy/:handle — by handle
app.get('/api/buddy/:handle', (req, res) => {
  const db = getDb();
  const buddy = db.prepare('SELECT * FROM buddies WHERE handle = ?').get(req.params.handle);

  if (!buddy) {
    return res.status(404).json({ error: 'Buddy non trouve' });
  }

  buddy.stats = JSON.parse(buddy.stats || '{}');
  buddy.shiny = !!buddy.shiny;
  res.json(buddy);
});

// GET /api/catch/:code — by share code
app.get('/api/catch/:code', (req, res) => {
  const db = getDb();
  const code = req.params.code.toUpperCase().trim();
  const buddy = db.prepare('SELECT * FROM buddies WHERE share_code = ?').get(code);

  if (!buddy) {
    return res.status(404).json({ error: 'Code de partage invalide' });
  }

  buddy.stats = JSON.parse(buddy.stats || '{}');
  buddy.shiny = !!buddy.shiny;
  res.json(buddy);
});

// GET /api/search
app.get('/api/search', (req, res) => {
  const { species, rarity, shiny } = req.query;
  const db = getDb();

  let query = 'SELECT * FROM buddies WHERE 1=1';
  const params = [];

  if (species) {
    query += ' AND species = ?';
    params.push(norm(species));
  }
  if (rarity) {
    query += ' AND rarity = ?';
    params.push(norm(rarity));
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

// GET /api/leaderboard
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
