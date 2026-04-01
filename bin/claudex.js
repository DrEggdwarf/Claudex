#!/usr/bin/env node

/**
 * Claudex CLI — Pokedex de buddies Claude Code.
 *
 * Usage:
 *   npx claudex                  Affiche ton buddy + s'enregistrer
 *   npx claudex catch XXXX-XXXX  Attrape un buddy via code de partage
 *   npx claudex pokedex          Affiche ta collection
 *   npx claudex me               Affiche ta carte de buddy
 *   npx claudex help             Aide
 */

const { renderCard } = require('../lib/render');
const { parseBuddyOutput } = require('../lib/parser');
const api = require('../lib/api');
const pokedex = require('../lib/pokedex');
const readline = require('readline');

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askMultiline(prompt) {
  return new Promise(resolve => {
    console.log(prompt);
    console.log('(colle le resultat puis appuie deux fois sur Entree pour valider)');
    console.log();

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const lines = [];
    let emptyCount = 0;

    rl.on('line', line => {
      if (line.trim() === '') {
        emptyCount++;
        if (emptyCount >= 2) {
          rl.close();
          resolve(lines.join('\n'));
          return;
        }
      } else {
        emptyCount = 0;
      }
      lines.push(line);
    });
  });
}

function printHeader() {
  console.log('+======================================+');
  console.log('|           C L A U D E X              |');
  console.log('|    Pokedex de buddies Claude Code     |');
  console.log('+======================================+');
  console.log();
}

// ── Register / Show buddy ──────────────────────────────────────────

async function cmdDefault() {
  printHeader();

  const dex = pokedex.load();

  if (dex.myHandle && dex.shareCode && dex.myBuddy) {
    // Already registered — show card
    console.log('Ton buddy :');
    console.log();
    console.log(renderCard({
      ...dex.myBuddy,
      handle: dex.myHandle,
      share_code: dex.shareCode,
    }));
    console.log();
    console.log(`Code de partage : ${dex.shareCode}`);
    console.log('Partage ce code pour que d\'autres dresseurs attrapent ton buddy !');
    console.log();
    console.log('Commandes :');
    console.log('  npx claudex catch XXXX-XXXX   Attraper un buddy');
    console.log('  npx claudex pokedex           Voir ta collection');
    console.log('  npx claudex me                Revoir ta carte');
    return;
  }

  // First time — register
  console.log('Bienvenue ! Enregistrons ton buddy sur le serveur central.');
  console.log();
  console.log('Etape 1 : Dans Claude Code, tape /buddy puis copie le resultat.');
  console.log();

  const buddyText = await askMultiline('Colle ici le resultat de /buddy :');
  const buddy = parseBuddyOutput(buddyText);

  if (!buddy.species || !buddy.rarity) {
    console.log();
    console.log('Impossible de detecter ton buddy. Verifie que tu as bien colle');
    console.log('le resultat complet de /buddy.');
    process.exit(1);
  }

  console.log();
  console.log(`Buddy detecte : ${buddy.species.toUpperCase()} ${buddy.rarity.toUpperCase()}${buddy.shiny ? ' SHINY' : ''}`);
  console.log();
  console.log(renderCard(buddy));
  console.log();

  const handle = await ask('Etape 2 : Choisis ton pseudo de dresseur : ');
  if (!handle) {
    console.log('Pseudo requis. Relance la commande.');
    process.exit(1);
  }

  const github = await ask('Ton pseudo GitHub (optionnel, appuie Entree pour passer) : ');

  try {
    console.log();
    console.log('Enregistrement en cours...');
    const result = await api.register({
      handle,
      species: buddy.species,
      rarity: buddy.rarity,
      eye: buddy.eye,
      hat: buddy.hat,
      shiny: buddy.shiny,
      stats: buddy.stats,
      github: github || null,
    });

    pokedex.setRegistration(handle, result.share_code, {
      species: buddy.species,
      rarity: buddy.rarity,
      eye: buddy.eye,
      hat: buddy.hat,
      shiny: buddy.shiny,
      stats: buddy.stats,
      name: buddy.name,
      github: github || null,
    });

    console.log();
    console.log('Enregistrement reussi !');
    console.log();
    console.log(renderCard({
      ...buddy,
      handle,
      github: github || null,
      share_code: result.share_code,
    }));
    console.log();
    console.log(`Ton code de partage : ${result.share_code}`);
    console.log('Partage-le pour que d\'autres dresseurs attrapent ton buddy !');
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement :', err.message);
    process.exit(1);
  }
}

// ── Catch ──────────────────────────────────────────────────────────

async function cmdCatch(code) {
  printHeader();

  if (!code) {
    code = await ask('Entre le code de partage (XXXX-XXXX) : ');
  }

  if (!code) {
    console.log('Code requis.');
    process.exit(1);
  }

  try {
    console.log('Recherche du buddy...');
    console.log();
    const buddy = await api.catchBuddy(code);

    const entry = {
      handle: buddy.handle,
      species: buddy.species,
      rarity: buddy.rarity,
      eye: buddy.eye,
      hat: buddy.hat,
      shiny: buddy.shiny,
      stats: buddy.stats,
      github: buddy.github,
      share_code: buddy.share_code,
      collectedAt: new Date().toISOString(),
    };

    pokedex.addBuddy(entry);

    console.log('Buddy attrape !');
    console.log();
    console.log(renderCard(entry));
    console.log();
    console.log(`${buddy.handle} a ete ajoute a ton Claudex !`);
  } catch (err) {
    console.error('Erreur :', err.message);
    process.exit(1);
  }
}

// ── Pokedex ────────────────────────────────────────────────────────

function cmdPokedex() {
  printHeader();

  const dex = pokedex.load();
  const stats = pokedex.getStats();

  console.log(`Collection : ${stats.total} buddy(s)`);
  if (stats.shinies > 0) console.log(`Shinies : ${stats.shinies}`);
  console.log();

  if (stats.total === 0) {
    console.log('Ton Claudex est vide !');
    console.log('Utilise "npx claudex catch XXXX-XXXX" pour attraper ton premier buddy.');
    return;
  }

  // Species summary
  const speciesLine = Object.entries(stats.bySpecies)
    .map(([s, n]) => `${s}(${n})`)
    .join('  ');
  console.log('Especes : ' + speciesLine);

  const rarityLine = Object.entries(stats.byRarity)
    .map(([r, n]) => `${r}(${n})`)
    .join('  ');
  console.log('Raretes : ' + rarityLine);
  console.log();

  // Render each card
  for (const buddy of dex.collected) {
    console.log(renderCard(buddy));
    console.log();
  }
}

// ── Me ─────────────────────────────────────────────────────────────

function cmdMe() {
  printHeader();

  const dex = pokedex.load();

  if (!dex.myBuddy) {
    console.log('Tu n\'es pas encore enregistre.');
    console.log('Lance "npx claudex" pour enregistrer ton buddy.');
    process.exit(1);
  }

  const buddy = { ...dex.myBuddy };
  if (dex.myHandle) buddy.handle = dex.myHandle;
  if (dex.shareCode) buddy.share_code = dex.shareCode;

  console.log(renderCard(buddy));
}

// ── Help ───────────────────────────────────────────────────────────

function cmdHelp() {
  printHeader();
  console.log('Commandes :');
  console.log();
  console.log('  npx claudex                  Voir/enregistrer ton buddy');
  console.log('  npx claudex catch XXXX-XXXX  Attraper un buddy via code');
  console.log('  npx claudex pokedex          Voir ta collection');
  console.log('  npx claudex me               Afficher ta carte');
  console.log('  npx claudex help             Cette aide');
  console.log();
  console.log('Claudex -- Collectez-les tous.');
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const cmd = (args[0] || '').toLowerCase();

  switch (cmd) {
    case '':
      await cmdDefault();
      break;
    case 'catch':
      await cmdCatch(args[1]);
      break;
    case 'pokedex':
      cmdPokedex();
      break;
    case 'me':
      cmdMe();
      break;
    case 'help':
    case '--help':
    case '-h':
      cmdHelp();
      break;
    default:
      console.log(`Commande inconnue : ${cmd}`);
      console.log('Tape "npx claudex help" pour l\'aide.');
      process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
