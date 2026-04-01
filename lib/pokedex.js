/**
 * Local Pokedex storage — persists to ~/.claudex/pokedex.json
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const DIR = path.join(os.homedir(), '.claudex');
const FILE = path.join(DIR, 'pokedex.json');

function ensureDir() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
}

function load() {
  ensureDir();
  if (!fs.existsSync(FILE)) {
    return { myHandle: null, shareCode: null, collected: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  } catch {
    return { myHandle: null, shareCode: null, collected: [] };
  }
}

function save(data) {
  ensureDir();
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function setRegistration(handle, shareCode, buddyData) {
  const dex = load();
  dex.myHandle = handle;
  dex.shareCode = shareCode;
  if (buddyData) dex.myBuddy = buddyData;
  save(dex);
  return dex;
}

function addBuddy(buddy) {
  const dex = load();
  // Don't add duplicates (by handle)
  const idx = dex.collected.findIndex(b => b.handle === buddy.handle);
  if (idx >= 0) {
    dex.collected[idx] = buddy;
  } else {
    dex.collected.push(buddy);
  }
  save(dex);
  return dex;
}

function getStats() {
  const dex = load();
  const stats = {
    total: dex.collected.length,
    bySpecies: {},
    byRarity: {},
    shinies: 0,
  };
  for (const b of dex.collected) {
    stats.bySpecies[b.species] = (stats.bySpecies[b.species] || 0) + 1;
    stats.byRarity[b.rarity] = (stats.byRarity[b.rarity] || 0) + 1;
    if (b.shiny) stats.shinies++;
  }
  return stats;
}

module.exports = { load, save, setRegistration, addBuddy, getStats };
