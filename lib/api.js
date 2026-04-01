/**
 * HTTP client for the Claudex central server.
 */

const API_BASE = 'http://217.69.13.112:3000/api';

async function register({ handle, species, rarity, eye, hat, shiny, stats, github }) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, species, rarity, eye, hat, shiny, stats, github }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur serveur (${res.status})`);
  }
  return res.json();
}

async function catchBuddy(code) {
  const res = await fetch(`${API_BASE}/catch/${encodeURIComponent(code)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Code invalide (${res.status})`);
  }
  return res.json();
}

async function getBuddy(handle) {
  const res = await fetch(`${API_BASE}/buddy/${encodeURIComponent(handle)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Buddy non trouve (${res.status})`);
  }
  return res.json();
}

async function search(query) {
  const params = new URLSearchParams(query);
  const res = await fetch(`${API_BASE}/search?${params}`);
  if (!res.ok) throw new Error(`Erreur recherche (${res.status})`);
  return res.json();
}

async function leaderboard() {
  const res = await fetch(`${API_BASE}/leaderboard`);
  if (!res.ok) throw new Error(`Erreur leaderboard (${res.status})`);
  return res.json();
}

module.exports = { register, catchBuddy, getBuddy, search, leaderboard };
