/**
 * Sprites ASCII officiels des 18 especes de buddies Claude Code.
 * Source: claude-buddy.vercel.app
 */

const SPRITES = {
  duck: [
    '    __      ',
    '  <({E} )___  ',
    '   (  ._>   ',
    '    `--´    ',
  ],
  goose: [
    '     ({E}>    ',
    '     ||     ',
    '   _(__)_   ',
    '    ^^^^    ',
  ],
  blob: [
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (      )  ',
    '   `----´   ',
  ],
  cat: [
    '   /\\_/\\    ',
    '  ( {E}   {E})  ',
    '  (  w  )   ',
    '  (")_(")   ',
  ],
  dragon: [
    '  /^\\  /^\\  ',
    ' <  {E}  {E}  > ',
    ' (   ~~   ) ',
    '  `-vvvv-´  ',
  ],
  octopus: [
    '   .----.   ',
    '  ( {E}  {E} )  ',
    '  (______)  ',
    '  /\\/\\/\\/\\  ',
  ],
  owl: [
    '   /\\  /\\   ',
    '  (({E})({E}))  ',
    '  (  ><  )  ',
    '   `----´   ',
  ],
  penguin: [
    '  .---.     ',
    '  ({E}>{E})     ',
    ' /(   )\\    ',
    '  `---´     ',
  ],
  turtle: [
    '   _,--._   ',
    '  ( {E}  {E} )  ',
    ' /[______]\\ ',
    '  ``    ``  ',
  ],
  snail: [
    ' {E}    .--.  ',
    '  \\  ( @ )  ',
    '   \\_`--´   ',
    '  ~~~~~~~   ',
  ],
  ghost: [
    '   .----.   ',
    '  / {E}  {E} \\  ',
    '  |      |  ',
    '  ~`~``~`~  ',
  ],
  axolotl: [
    '}~(______)~{',
    '}~({E} .. {E})~{',
    '  ( .--. )  ',
    '  (_/  \\_)  ',
  ],
  capybara: [
    '  n______n  ',
    ' ( {E}    {E} ) ',
    ' (   oo   ) ',
    '  `------´  ',
  ],
  cactus: [
    ' n  ____  n ',
    ' | |{E}  {E}| | ',
    ' |_|    |_| ',
    '   |    |   ',
  ],
  robot: [
    '   .[||].   ',
    '  [ {E}  {E} ]  ',
    '  [ ==== ]  ',
    '  `------´  ',
  ],
  rabbit: [
    '   (\\__/)   ',
    '  ( {E}  {E} )  ',
    ' =(  ..  )= ',
    '  (")__(")  ',
  ],
  mushroom: [
    ' .-o-OO-o-. ',
    '(__________)',
    '   |{E}  {E}|   ',
    '   |____|   ',
  ],
  chonk: [
    '  /\\    /\\  ',
    ' ( {E}    {E} ) ',
    ' (   ..   ) ',
    '  `------´  ',
  ]
};

// Map eye names from /buddy to actual chars
const EYE_MAP = {
  'curious':  'o',
  'default':  '.',
  'sparkle':  '*',
  'cross':    'x',
  'dot':      '.',
  'wide':     'O',
  'star':     '*',
  // Direct chars pass through
};

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

// Map stat names from /buddy to display names
const STAT_NAMES = {
  'hp': 'HP',
  'atk': 'ATK',
  'def': 'DEF',
  'spd': 'SPD',
  'debugging': 'DEBUG',
  'patience': 'PATIENCE',
  'chaos': 'CHAOS',
  'wisdom': 'WISDOM',
  'snark': 'SNARK',
};

function formatDate(isoString) {
  if (!isoString) return '???';
  const d = new Date(isoString);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function resolveEye(eye) {
  if (!eye) return '.';
  if (eye.length === 1) return eye;
  return EYE_MAP[eye.toLowerCase()] || '.';
}

function renderSprite(species, eye, hat) {
  const key = (species || 'blob').toLowerCase();
  const sprite = (SPRITES[key] || SPRITES.blob).map(l => l);
  const eyeChar = resolveEye(eye);
  const rendered = sprite.map(line => line.replace(/\{E\}/g, eyeChar));

  const hatKey = (hat || 'none').toLowerCase();
  if (hatKey !== 'none' && HATS[hatKey]) {
    rendered.unshift(HATS[hatKey]);
  }

  return rendered;
}

function renderBuddy(buddy) {
  const species = (buddy.species || 'blob').toLowerCase();
  const sprite = renderSprite(species, buddy.eye, buddy.hat);
  const isShiny = buddy.shiny;
  const rarity = (buddy.rarity || 'common').toLowerCase();
  const W = 38;

  // Simple box drawing
  function line(content) {
    const text = content.slice(0, W - 4);
    return '| ' + text + ' '.repeat(W - 4 - text.length) + ' |';
  }
  function sep() {
    return '+' + '-'.repeat(W - 2) + '+';
  }
  function doubleSep() {
    return '+' + '='.repeat(W - 2) + '+';
  }

  const lines = [];

  // Shiny top border
  if (isShiny) {
    lines.push('~*'.repeat(Math.floor(W / 2)));
  }

  // Top
  if (rarity === 'legendary' || rarity === 'epic') {
    lines.push(doubleSep());
  } else {
    lines.push(sep());
  }

  // Name + shiny
  const shinyTag = isShiny ? '  << SHINY >>' : '';
  lines.push(line(species.toUpperCase() + shinyTag));

  // Rarity
  const rarityLabels = {
    common: 'COMMON', uncommon: 'UNCOMMON',
    rare: '* RARE *', epic: '** EPIC **',
    legendary: '<<< LEGENDARY >>>'
  };
  lines.push(line(rarityLabels[rarity] || rarity.toUpperCase()));

  lines.push(sep());

  // Sprite
  lines.push(line(''));
  sprite.forEach(l => lines.push(line('    ' + l)));
  lines.push(line(''));

  lines.push(sep());

  // Info
  lines.push(line('Dresseur:  @' + (buddy.handle || '???')));
  if (buddy.github) {
    lines.push(line('GitHub:    github.com/' + buddy.github));
  }
  if (buddy.collectedAt) {
    lines.push(line('Attrape:   ' + formatDate(buddy.collectedAt)));
  }
  if (buddy.share_code) {
    lines.push(line('Code:      ' + buddy.share_code));
  }

  // Stats
  if (buddy.stats && Object.keys(buddy.stats).length > 0) {
    lines.push(sep());
    for (const [stat, val] of Object.entries(buddy.stats)) {
      const label = STAT_NAMES[stat.toLowerCase()] || stat.slice(0, 8).toUpperCase();
      const filled = Math.min(10, Math.round(val / 10));
      const empty = 10 - filled;
      const bar = '#'.repeat(filled) + '.'.repeat(empty);
      lines.push(line(label.padEnd(9) + bar + ' ' + String(val).padStart(3)));
    }
  }

  // Bottom
  if (rarity === 'legendary' || rarity === 'epic') {
    lines.push(doubleSep());
  } else {
    lines.push(sep());
  }

  // Shiny bottom border
  if (isShiny) {
    lines.push('~*'.repeat(Math.floor(W / 2)));
  }

  return lines.join('\n');
}

function renderPokedex(collected) {
  if (!collected || collected.length === 0) {
    return [
      '+================================+',
      '|         C L A U D E X          |',
      '+================================+',
      '|                                |',
      '|  Ton Claudex est vide.         |',
      '|                                |',
      '|  /claudex > option 2 pour      |',
      '|  attraper ton premier buddy.   |',
      '|                                |',
      '+================================+'
    ].join('\n');
  }

  const lines = [];
  lines.push('+================================+');
  lines.push('|         C L A U D E X          |');
  lines.push('|  ' + String(collected.length).padStart(3) + ' buddy(ies) attrape(s)    |');
  lines.push('+================================+');
  lines.push('');

  collected.forEach((buddy, i) => {
    lines.push(renderBuddy(buddy));
    if (i < collected.length - 1) lines.push('');
  });

  return lines.join('\n');
}

module.exports = { SPRITES, HATS, renderSprite, renderBuddy, renderPokedex, resolveEye };
