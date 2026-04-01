const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'claudex.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS buddies (
      handle TEXT PRIMARY KEY,
      share_code TEXT UNIQUE NOT NULL,
      species TEXT NOT NULL,
      rarity TEXT NOT NULL,
      eye TEXT,
      hat TEXT,
      shiny BOOLEAN DEFAULT FALSE,
      stats JSON,
      github TEXT,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_handle TEXT NOT NULL,
      to_handle TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: add share_code if missing
  const cols = db.prepare("PRAGMA table_info(buddies)").all();
  if (!cols.find(c => c.name === 'share_code')) {
    db.exec("ALTER TABLE buddies ADD COLUMN share_code TEXT");
    db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_share_code ON buddies(share_code)");
  }
}

function generateShareCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // no 0/O/1/I confusion
  let code = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function getUniqueShareCode() {
  const d = getDb();
  for (let i = 0; i < 100; i++) {
    const code = generateShareCode();
    const existing = d.prepare('SELECT 1 FROM buddies WHERE share_code = ?').get(code);
    if (!existing) return code;
  }
  throw new Error('Could not generate unique share code');
}

module.exports = { getDb, getUniqueShareCode };
