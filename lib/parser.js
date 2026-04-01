/**
 * Parse the output of Claude Code's /buddy command.
 */

const KNOWN_SPECIES = [
  'duck', 'goose', 'blob', 'cat', 'dragon', 'octopus',
  'owl', 'penguin', 'turtle', 'snail', 'ghost', 'axolotl',
  'capybara', 'cactus', 'robot', 'rabbit', 'mushroom', 'chonk'
];

const KNOWN_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

const EYE_CHARS = ['·', '✦', '×', '◉', '@', '°', '.', 'o', 'O', '*'];

const HAT_PATTERNS = {
  '\\^^^/':  'crown',
  '[___]':   'tophat',
  '-+-':     'propeller',
  '(   )':   'halo',
  '/^\\':    'wizard',
  '(___)':   'beanie',
  ',>':      'tinyduck',
};

function parseBuddyOutput(text) {
  const lines = text.split('\n').map(l => l.replace(/[│╭╰╮╯─]/g, '').trim());

  let species = null;
  let rarity = null;
  let shiny = false;
  let name = null;
  let hat = 'none';
  let eye = '.';
  const stats = {};

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Detect shiny
    if (lower.includes('shiny')) {
      shiny = true;
    }

    // Detect rarity + species on same line (e.g. "★★★★★ LEGENDARY             DRAGON")
    for (const r of KNOWN_RARITIES) {
      if (lower.includes(r)) {
        rarity = r;
        for (const s of KNOWN_SPECIES) {
          if (lower.includes(s)) {
            species = s;
            break;
          }
        }
        break;
      }
    }

    // Detect species alone if not found yet
    if (!species) {
      for (const s of KNOWN_SPECIES) {
        if (lower === s || lower.endsWith(s)) {
          species = s;
          break;
        }
      }
    }

    // Detect hat
    for (const [pattern, hatName] of Object.entries(HAT_PATTERNS)) {
      if (line.includes(pattern)) {
        hat = hatName;
        break;
      }
    }

    // Detect stats (e.g. "DEBUGGING  ██████████ 100")
    const statMatch = line.match(/^(DEBUGGING|PATIENCE|CHAOS|WISDOM|SNARK)\s+.*?(\d+)\s*$/);
    if (statMatch) {
      stats[statMatch[1]] = parseInt(statMatch[2], 10);
    }

    // Detect name — a line that's just a word/short phrase, not matching other patterns
    // The name appears after the sprite, before the description
    // We'll use a heuristic: short line (< 30 chars), not empty, not a stat, not known pattern
    if (!name && line.length > 0 && line.length < 30 &&
        !lower.includes('shiny') && !lower.includes('legendary') &&
        !lower.includes('common') && !lower.includes('rare') &&
        !lower.includes('epic') && !lower.includes('last said') &&
        !statMatch && !line.includes('█') && !line.includes('░') &&
        !line.startsWith('"') && !line.startsWith('*') &&
        !line.includes('/') && !line.includes('\\') && !line.includes('<') &&
        !line.includes('(') && !line.includes('[') && !line.includes('-') &&
        !line.includes('~') && !line.includes('^') && !line.includes('`') &&
        !line.includes('>') && !line.includes('|') && !line.includes('_') &&
        /^[A-Za-z]/.test(line)) {
      // Could be the name — but only after we've seen the species
      if (species) {
        name = line;
      }
    }
  }

  // Detect eye from sprite lines
  if (species) {
    for (const line of lines) {
      for (const e of EYE_CHARS) {
        // Look for the eye char appearing twice (both eyes) in a sprite-like line
        const count = line.split(e).length - 1;
        if (count >= 2 && line.length < 40) {
          eye = e;
          break;
        }
      }
      if (eye !== '.') break;
    }
  }

  return { species, rarity, shiny, name, hat, eye, stats };
}

module.exports = { parseBuddyOutput };
