/**
 * ASCII rendering for buddy cards.
 */

const SPRITES = {
  duck:     ['    __      ', '  <({E} )___  ', '   (  ._>   ', '    `--´    '],
  goose:    ['     ({E}>    ', '     ||     ', '   _(__)_   ', '    ^^^^    '],
  blob:     ['   .----.   ', '  ( {E}  {E} )  ', '  (      )  ', '   `----´   '],
  cat:      ['   /\\_/\\    ', '  ( {E}   {E})  ', '  (  w  )   ', '  (")_(")   '],
  dragon:   ['  /^\\  /^\\  ', ' <  {E}  {E}  > ', ' (   ~~   ) ', '  `-vvvv-´  '],
  octopus:  ['   .----.   ', '  ( {E}  {E} )  ', '  (______)  ', '  /\\/\\/\\/\\  '],
  owl:      ['   /\\  /\\   ', '  (({E})({E}))  ', '  (  ><  )  ', '   `----´   '],
  penguin:  ['  .---.     ', '  ({E}>{E})     ', ' /(   )\\    ', '  `---´     '],
  turtle:   ['   _,--._   ', '  ( {E}  {E} )  ', ' /[______]\\ ', '  ``    ``  '],
  snail:    [' {E}    .--.  ', '  \\  ( @ )  ', '   \\_`--´   ', '  ~~~~~~~   '],
  ghost:    ['   .----.   ', '  / {E}  {E} \\  ', '  |      |  ', '  ~`~``~`~  '],
  axolotl:  ['}~(______)~{', '}~({E} .. {E})~{', '  ( .--. )  ', '  (_/  \\_)  '],
  capybara: ['  n______n  ', ' ( {E}    {E} ) ', ' (   oo   ) ', '  `------´  '],
  cactus:   [' n  ____  n ', ' | |{E}  {E}| | ', ' |_|    |_| ', '   |    |   '],
  robot:    ['   .[||].   ', '  [ {E}  {E} ]  ', '  [ ==== ]  ', '  `------´  '],
  rabbit:   ['   (\\__/)   ', '  ( {E}  {E} )  ', ' =(  ..  )= ', '  (")__(")  '],
  mushroom: [' .-o-OO-o-. ', '(__________)', '   |{E}  {E}|   ', '   |____|   '],
  chonk:    ['  /\\    /\\  ', ' ( {E}    {E} ) ', ' (   ..   ) ', '  `------´  '],
};

const HAT_ART = {
  none:      null,
  crown:     '   \\^^^/    ',
  tophat:    '   [___]    ',
  propeller: '    -+-     ',
  halo:      '   (   )    ',
  wizard:    '    /^\\     ',
  beanie:    '   (___)    ',
  tinyduck:  '    ,>      ',
};

function renderCard(buddy) {
  const species = (buddy.species || 'blob').toLowerCase();
  const eye = buddy.eye || '.';
  const hat = (buddy.hat || 'none').toLowerCase();
  const rarity = (buddy.rarity || 'common').toLowerCase();
  const isShiny = buddy.shiny;
  const W = 38;

  // Build sprite
  const spriteLines = (SPRITES[species] || SPRITES.blob).map(l => l.replace(/\{E\}/g, eye));
  if (hat !== 'none' && HAT_ART[hat]) {
    spriteLines.unshift(HAT_ART[hat]);
  }

  const pad = (s) => {
    const t = (s || '').slice(0, W - 4);
    return '| ' + t + ' '.repeat(W - 4 - t.length) + ' |';
  };
  const sep = () => '+' + '-'.repeat(W - 2) + '+';
  const thick = () => '+' + '='.repeat(W - 2) + '+';

  const lines = [];

  if (isShiny) lines.push('~*'.repeat(W / 2 | 0));

  lines.push(rarity === 'epic' || rarity === 'legendary' ? thick() : sep());

  const tag = isShiny ? '  << SHINY >>' : '';
  const nameStr = buddy.name ? `${species.toUpperCase()} "${buddy.name}"` : species.toUpperCase();
  lines.push(pad(nameStr + tag));

  const labels = { common: 'COMMON', uncommon: 'UNCOMMON', rare: '* RARE *', epic: '** EPIC **', legendary: '<<< LEGENDARY >>>' };
  lines.push(pad(labels[rarity] || rarity));

  lines.push(sep());
  lines.push(pad(''));
  spriteLines.forEach(l => lines.push(pad('    ' + l)));
  lines.push(pad(''));
  lines.push(sep());

  if (buddy.handle) lines.push(pad('Dresseur:  @' + buddy.handle));
  if (buddy.github) lines.push(pad('GitHub:    github.com/' + buddy.github));
  if (buddy.collectedAt) lines.push(pad('Attrape:   ' + fmtDate(buddy.collectedAt)));
  if (buddy.share_code) lines.push(pad('Code:      ' + buddy.share_code));

  if (buddy.stats && Object.keys(buddy.stats).length > 0) {
    lines.push(sep());
    for (const [stat, val] of Object.entries(buddy.stats)) {
      const label = stat.slice(0, 9).toUpperCase().padEnd(9);
      const filled = Math.min(10, Math.round(val / 10));
      const bar = '#'.repeat(filled) + '.'.repeat(10 - filled);
      lines.push(pad(`${label} ${bar} ${String(val).padStart(3)}`));
    }
  }

  lines.push(rarity === 'epic' || rarity === 'legendary' ? thick() : sep());
  if (isShiny) lines.push('~*'.repeat(W / 2 | 0));

  return lines.join('\n');
}

function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '???';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

module.exports = { renderCard };
