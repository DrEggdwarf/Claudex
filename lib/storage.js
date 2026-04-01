const fs = require('fs');
const path = require('path');

const CLAUDEX_DIR = path.join(process.env.HOME, '.claudex');
const POKEDEX_PATH = path.join(CLAUDEX_DIR, 'pokedex.json');

function ensureDir() {
  if (!fs.existsSync(CLAUDEX_DIR)) {
    fs.mkdirSync(CLAUDEX_DIR, { recursive: true });
  }
}

function loadPokedex() {
  ensureDir();
  if (!fs.existsSync(POKEDEX_PATH)) {
    const initial = {
      myHandle: null,
      collected: [],
      stats: { total: 0, bySpecies: {}, byRarity: {}, shinies: 0 }
    };
    fs.writeFileSync(POKEDEX_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(POKEDEX_PATH, 'utf-8'));
}

function savePokedex(pokedex) {
  ensureDir();
  fs.writeFileSync(POKEDEX_PATH, JSON.stringify(pokedex, null, 2));
}

function setHandle(handle) {
  const pokedex = loadPokedex();
  pokedex.myHandle = handle;
  savePokedex(pokedex);
  return pokedex;
}

function addBuddy(buddy) {
  const pokedex = loadPokedex();

  // Ne pas ajouter un doublon
  const existing = pokedex.collected.find(b => b.handle === buddy.handle);
  if (existing) {
    return { added: false, reason: 'already_collected', pokedex };
  }

  const entry = {
    handle: buddy.handle,
    species: buddy.species,
    rarity: buddy.rarity,
    shiny: buddy.shiny || false,
    stats: buddy.stats || {},
    eye: buddy.eye || null,
    hat: buddy.hat || null,
    github: buddy.github || null,
    collectedAt: new Date().toISOString()
  };

  pokedex.collected.push(entry);

  // Mettre à jour les stats
  pokedex.stats.total = pokedex.collected.length;
  pokedex.stats.bySpecies[entry.species] = (pokedex.stats.bySpecies[entry.species] || 0) + 1;
  pokedex.stats.byRarity[entry.rarity] = (pokedex.stats.byRarity[entry.rarity] || 0) + 1;
  if (entry.shiny) pokedex.stats.shinies++;

  savePokedex(pokedex);
  return { added: true, entry, pokedex };
}

function setShareCode(code) {
  const pokedex = loadPokedex();
  pokedex.shareCode = code;
  savePokedex(pokedex);
  return pokedex;
}

function getPokedex() {
  return loadPokedex();
}

module.exports = { loadPokedex, savePokedex, setHandle, setShareCode, addBuddy, getPokedex };
