/**
 * Sprites ASCII officiels des 18 espèces de buddies Claude Code.
 * Source: claude-buddy.vercel.app
 * {E} = placeholder pour le style d'yeux du buddy
 */

const SPRITES = {
  duck: [
    '            ',
    '    __      ',
    '  <({E} )___  ',
    '   (  ._>   ',
    '    `--´    '
  ],
  goose: [
    '            ',
    '     ({E}>    ',
    '     ||     ',
    '   _(__)_   ',
    '    ^^^^    '
  ],
  blob: [
    '            ',
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (      )  ',
    '   `----´   '
  ],
  cat: [
    '            ',
    '   /\\_/\\    ',
    '  ( {E}   {E})  ',
    '  (  ω  )   ',
    '  (")_(")   '
  ],
  dragon: [
    '            ',
    '  /^\\  /^\\  ',
    ' <  {E}  {E}  > ',
    ' (   ~~   ) ',
    '  `-vvvv-´  '
  ],
  octopus: [
    '            ',
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (______)  ',
    '  /\\/\\/\\/\\  '
  ],
  owl: [
    '            ',
    '   /\\  /\\   ',
    '  (({E})({E}))  ',
    '  (  ><  )  ',
    '   `----´   '
  ],
  penguin: [
    '            ',
    '  .---.     ',
    '  ({E}>{E})     ',
    ' /(   )\\    ',
    '  `---´     '
  ],
  turtle: [
    '            ',
    '   _,--._   ',
    '  ( {E}  {E} )  ',
    ' /[______]\\ ',
    '  ``    ``  '
  ],
  snail: [
    '            ',
    ' {E}    .--.  ',
    '  \\  ( @ )  ',
    '   \\_`--´   ',
    '  ~~~~~~~   '
  ],
  ghost: [
    '            ',
    '   .----.   ',
    '  / {E}  {E} \\  ',
    '  |      |  ',
    '  ~`~``~`~  '
  ],
  axolotl: [
    '            ',
    '}~(______)~{',
    '}~({E} .. {E})~{',
    '  ( .--. )  ',
    '  (_/  \\_)  '
  ],
  capybara: [
    '            ',
    '  n______n  ',
    ' ( {E}    {E} ) ',
    ' (   oo   ) ',
    '  `------´  '
  ],
  cactus: [
    '            ',
    ' n  ____  n ',
    ' | |{E}  {E}| | ',
    ' |_|    |_| ',
    '   |    |   '
  ],
  robot: [
    '            ',
    '   .[||].   ',
    '  [ {E}  {E} ]  ',
    '  [ ==== ]  ',
    '  `------´  '
  ],
  rabbit: [
    '            ',
    '   (\\__/)   ',
    '  ( {E}  {E} )  ',
    ' =(  ..  )= ',
    '  (")__(")  '
  ],
  mushroom: [
    '            ',
    ' .-o-OO-o-. ',
    '(__________)',
    '   |{E}  {E}|   ',
    '   |____|   '
  ],
  chonk: [
    '            ',
    '  /\\    /\\  ',
    ' ( {E}    {E} ) ',
    ' (   ..   ) ',
    '  `------´  '
  ]
};

const EYES = ['·', '✦', '×', '◉', '@', '°'];

const HATS = {
  none:      '            ',
  crown:     '   \\^^^/    ',
  tophat:    '   [___]    ',
  propeller: '    -+-     ',
  halo:      '   (   )    ',
  wizard:    '    /^\\     ',
  beanie:    '   (___)    ',
  tinyduck:  '    ,>      '
};

// Bordures et décorations par rareté
const RARITY_STYLE = {
  common: {
    tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│',
    deco: '',
    label: '  COMMON'
  },
  uncommon: {
    tl: '╒', tr: '╕', bl: '╘', br: '╛', h: '═', v: '│',
    deco: '~',
    label: '  UNCOMMON'
  },
  rare: {
    tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║',
    deco: '*',
    label: '✦ RARE ✦'
  },
  epic: {
    tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║',
    deco: '★',
    label: '★ EPIC ★'
  },
  legendary: {
    tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║',
    deco: '◆',
    label: '◆ LEGENDARY ◆'
  }
};

function formatDate(isoString) {
  if (!isoString) return '???';
  const d = new Date(isoString);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function renderSprite(species, eye, hat) {
  const sprite = (SPRITES[species] || SPRITES.blob).map(l => l);
  const eyeChar = eye || '·';
  const rendered = sprite.map(line => line.replace(/\{E\}/g, eyeChar));
  if (hat && hat !== 'none' && HATS[hat]) {
    rendered[0] = HATS[hat];
  }
  return rendered;
}

function renderBuddy(buddy) {
  const sprite = renderSprite(buddy.species, buddy.eye, buddy.hat);
  const s = RARITY_STYLE[buddy.rarity] || RARITY_STYLE.common;
  const isShiny = buddy.shiny;
  const W = 36;

  function pad(content) {
    const padded = content.padEnd(W - 4);
    return `${s.v} ${padded.slice(0, W - 4)} ${s.v}`;
  }

  const lines = [];

  // Shiny: sparkle border on top
  if (isShiny) {
    lines.push(`✨${s.h}${s.h}✨${s.h.repeat(W - 8)}✨${s.h}${s.h}✨`);
  }

  // Top border — epic/legendary get decorated corners
  if (s.deco && (buddy.rarity === 'epic' || buddy.rarity === 'legendary')) {
    const inner = s.h.repeat(W - 6);
    lines.push(`${s.tl}${s.deco}${inner}${s.deco}${s.tr}`);
  } else {
    lines.push(`${s.tl}${s.h.repeat(W - 2)}${s.tr}`);
  }

  // Species name + shiny tag
  const shinyTag = isShiny ? ' ✨ SHINY ✨' : '';
  lines.push(pad(`${(buddy.species || '???').toUpperCase()}${shinyTag}`));

  // Rarity label
  lines.push(pad(s.label));

  // Separator line per rarity
  if (buddy.rarity === 'legendary') {
    lines.push(pad('◆─────────────────────────────◆'));
  } else if (buddy.rarity === 'epic') {
    lines.push(pad('★─────────────────────────────★'));
  } else if (buddy.rarity === 'rare') {
    lines.push(pad('✦ · · · · · · · · · · · · · ✦'));
  } else {
    lines.push(pad(''));
  }

  // Sprite
  sprite.forEach(l => lines.push(pad(`  ${l}`)));

  lines.push(pad(''));

  // Infos dresseur
  lines.push(pad(`Dresseur: @${buddy.handle || '???'}`));
  if (buddy.github) {
    lines.push(pad(`GitHub:   github.com/${buddy.github}`));
  }
  if (buddy.collectedAt) {
    lines.push(pad(`Attrapé:  ${formatDate(buddy.collectedAt)}`));
  }

  // Stats
  if (buddy.stats && Object.keys(buddy.stats).length > 0) {
    lines.push(pad(''));
    for (const [stat, val] of Object.entries(buddy.stats)) {
      const filled = Math.round(val / 10);
      const empty = 10 - filled;
      // Barres différentes par rareté
      let fillChar = '█', emptyChar = '░';
      if (buddy.rarity === 'legendary') { fillChar = '◆'; emptyChar = '◇'; }
      else if (buddy.rarity === 'epic') { fillChar = '★'; emptyChar = '☆'; }
      else if (buddy.rarity === 'rare') { fillChar = '▓'; emptyChar = '░'; }
      const bar = fillChar.repeat(filled) + emptyChar.repeat(empty);
      lines.push(pad(`${stat.slice(0, 8).padEnd(8)} ${bar} ${String(val).padStart(3)}`));
    }
  }

  // Bottom border
  if (s.deco && (buddy.rarity === 'epic' || buddy.rarity === 'legendary')) {
    const inner = s.h.repeat(W - 6);
    lines.push(`${s.bl}${s.deco}${inner}${s.deco}${s.br}`);
  } else {
    lines.push(`${s.bl}${s.h.repeat(W - 2)}${s.br}`);
  }

  // Shiny: sparkle border on bottom
  if (isShiny) {
    lines.push(`✨${s.h}${s.h}✨${s.h.repeat(W - 8)}✨${s.h}${s.h}✨`);
  }

  return lines.join('\n');
}

function renderPokedex(collected) {
  if (!collected || collected.length === 0) {
    return [
      '╔══════════════════════════════════╗',
      '║        📖 C L A U D E X         ║',
      '╠══════════════════════════════════╣',
      '║                                  ║',
      '║  📭 Ton Claudex est vide !       ║',
      '║                                  ║',
      '║  Utilise /claudex puis option 2  ║',
      '║  pour attraper ton premier buddy ║',
      '║                                  ║',
      '╚══════════════════════════════════╝'
    ].join('\n');
  }

  const lines = [];
  lines.push('╔══════════════════════════════════╗');
  lines.push('║        📖 C L A U D E X         ║');
  lines.push(`║   ${String(collected.length).padStart(3)} buddy(ies) attrapé(s)     ║`);
  lines.push('╚══════════════════════════════════╝');
  lines.push('');

  collected.forEach((buddy, i) => {
    lines.push(renderBuddy(buddy));
    if (i < collected.length - 1) lines.push('');
  });

  return lines.join('\n');
}

module.exports = { SPRITES, EYES, HATS, renderSprite, renderBuddy, renderPokedex };
