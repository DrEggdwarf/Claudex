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

const RARITY_BORDER = {
  common:    { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  uncommon:  { tl: '╒', tr: '╕', bl: '╘', br: '╛', h: '═', v: '│' },
  rare:      { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
  epic:      { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
  legendary: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' }
};

const RARITY_LABEL = {
  common:    '   COMMON   ',
  uncommon:  '  UNCOMMON  ',
  rare:      '    RARE    ',
  epic:      '  ★ EPIC ★  ',
  legendary: '★ LEGENDARY ★'
};

function formatDate(isoString) {
  if (!isoString) return '???';
  const d = new Date(isoString);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function renderSprite(species, eye, hat) {
  const sprite = (SPRITES[species] || SPRITES.blob).map(l => l);
  const eyeChar = eye || '·';

  // Replace {E} with the eye character
  const rendered = sprite.map(line => line.replace(/\{E\}/g, eyeChar));

  // Apply hat (replace first line)
  if (hat && hat !== 'none' && HATS[hat]) {
    rendered[0] = HATS[hat];
  }

  return rendered;
}

function renderBuddy(buddy) {
  const sprite = renderSprite(buddy.species, buddy.eye, buddy.hat);
  const shinyTag = buddy.shiny ? ' ✨ SHINY' : '';
  const b = RARITY_BORDER[buddy.rarity] || RARITY_BORDER.common;
  const W = 36;

  function pad(content) {
    // Simple padding — just ensure line fits in the box
    const padded = content.padEnd(W - 4);
    return `${b.v} ${padded.slice(0, W - 4)} ${b.v}`;
  }

  const lines = [];
  lines.push(`${b.tl}${b.h.repeat(W - 2)}${b.tr}`);
  lines.push(pad(`${(buddy.species || '???').toUpperCase()}${shinyTag}`));
  lines.push(pad(`${RARITY_LABEL[buddy.rarity] || buddy.rarity}`));
  lines.push(pad(``));

  sprite.forEach(l => lines.push(pad(`  ${l}`)));

  lines.push(pad(``));
  lines.push(pad(`Dresseur: @${buddy.handle || '???'}`));
  if (buddy.github) {
    lines.push(pad(`GitHub:   github.com/${buddy.github}`));
  }
  if (buddy.collectedAt) {
    lines.push(pad(`Attrapé:  ${formatDate(buddy.collectedAt)}`));
  }

  if (buddy.stats && Object.keys(buddy.stats).length > 0) {
    lines.push(pad(``));
    for (const [stat, val] of Object.entries(buddy.stats)) {
      const filled = Math.round(val / 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
      lines.push(pad(`${stat.slice(0, 8).padEnd(8)} ${bar} ${String(val).padStart(3)}`));
    }
  }

  lines.push(`${b.bl}${b.h.repeat(W - 2)}${b.br}`);
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
