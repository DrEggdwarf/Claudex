/**
 * Buddy generation — exact replica of Claude Code's algorithm.
 * Mulberry32 PRNG + FNV-1a hash, seeded from accountUuid.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SALT = '1f7v_cwm5nj8blr';

const SPECIES = [
  'duck', 'goose', 'blob', 'cat', 'dragon', 'octopus',
  'owl', 'penguin', 'turtle', 'snail', 'ghost', 'axolotl',
  'capybara', 'cactus', 'robot', 'rabbit', 'mushroom', 'chonk'
];

const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const RARITY_WEIGHTS = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };
const RARITY_STAT_BASE = { common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50 };

const EYES = ['·', '✦', '×', '◉', '@', '°'];
const HATS = ['none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck'];
const STATS = ['DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK'];

// FNV-1a hash
function fnv1a(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// Mulberry32 PRNG
function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = s + 1831565813 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function selectRarity(rng) {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (const k of RARITIES) {
    r -= RARITY_WEIGHTS[k];
    if (r < 0) return k;
  }
  return 'common';
}

function generateStats(rng, rarity) {
  const base = RARITY_STAT_BASE[rarity];
  const primary = pick(rng, STATS);
  let secondary = pick(rng, STATS);
  while (secondary === primary) secondary = pick(rng, STATS);

  const stats = {};
  for (const s of STATS) {
    if (s === primary) {
      stats[s] = Math.min(100, base + 50 + Math.floor(rng() * 30));
    } else if (s === secondary) {
      stats[s] = Math.max(1, base - 10 + Math.floor(rng() * 15));
    } else {
      stats[s] = base + Math.floor(rng() * 40);
    }
  }
  return stats;
}

function generateBuddy(userId) {
  const seed = fnv1a(userId + SALT);
  const rng = mulberry32(seed);

  const rarity = selectRarity(rng);
  const species = pick(rng, SPECIES);
  const eye = pick(rng, EYES);
  const hat = rarity === 'common' ? 'none' : pick(rng, HATS);
  const shiny = rng() < 0.01;
  const stats = generateStats(rng, rarity);

  return { species, rarity, eye, hat, shiny, stats };
}

function getUserId() {
  const configPath = path.join(os.homedir(), '.claude.json');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config.oauthAccount?.accountUuid || config.userID || null;
  } catch {
    return null;
  }
}

function getCompanionName() {
  const configPath = path.join(os.homedir(), '.claude.json');
  if (!fs.existsSync(configPath)) return null;
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config.companion?.name || null;
  } catch {
    return null;
  }
}

function getMyBuddy() {
  const userId = getUserId();
  if (!userId) return null;
  const buddy = generateBuddy(userId);
  buddy.name = getCompanionName();
  return buddy;
}

module.exports = { generateBuddy, getUserId, getMyBuddy, getCompanionName };
