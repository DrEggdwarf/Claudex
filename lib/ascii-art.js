/**
 * Sprites ASCII pour les 18 espèces de buddies.
 */

const SPRITES = {
  axolotl: [
    '   ∧ _ ∧   ',
    '  ( ◉ ω ◉ ) ',
    ' /|     |\\  ',
    '(_|  ~  |_) ',
    '   \\_^_/    '
  ],
  cat: [
    '  /\\_/\\  ',
    ' ( o.o ) ',
    '  > ^ <  ',
    ' /|   |\\ ',
    '(_|   |_)'
  ],
  dog: [
    '  ∧___∧  ',
    ' (• ᴥ •) ',
    ' /     \\ ',
    '|  U U  |',
    ' \\_____/ '
  ],
  dragon: [
    '   /\\_    ',
    '  / o >   ',
    ' |  ^  \\  ',
    ' /\\/\\/\\  \\ ',
    '|________|'
  ],
  fox: [
    '  /\\ /\\  ',
    ' ( • • ) ',
    '  \\ ▼ /  ',
    '  /   \\  ',
    ' (_/ \\_) '
  ],
  ghost: [
    '  .---.  ',
    ' / o o \\ ',
    '|   ▽   |',
    ' \\     / ',
    '  ~~~~~  '
  ],
  hamster: [
    '  (\\(\\   ',
    ' ( – –)  ',
    ' o_(\")(\") ',
    '  |   |  ',
    '  *   *  '
  ],
  owl: [
    '  {o,o}  ',
    '  /)  )  ',
    ' / \"--\"  ',
    ' \\  |  / ',
    '  ^^ ^^  '
  ],
  panda: [
    '  ┌───┐  ',
    ' │● ●│  ',
    ' │ ▽ │  ',
    '  └─┬─┘  ',
    '    |    '
  ],
  penguin: [
    '   (o)   ',
    '  /| |\\  ',
    ' (_| |_) ',
    '   | |   ',
    '  _| |_  '
  ],
  phoenix: [
    '   ,//   ',
    '  (o>    ',
    ' //|\\\\   ',
    '// | \\\\  ',
    '~~~~~~~  '
  ],
  rabbit: [
    '  (\\(\\   ',
    '  ( -.-)  ',
    ' o_(\")(\")',
    '  /   \\  ',
    ' (_/ \\_) '
  ],
  robot: [
    ' ┌─┬─┐  ',
    ' │◉ ◉│  ',
    ' ├───┤  ',
    ' │ ≡ │  ',
    ' └─┴─┘  '
  ],
  slime: [
    '  .---.  ',
    ' /     \\ ',
    '| ◦   ◦ |',
    ' \\ ‿ /  ',
    '  ~~~~   '
  ],
  snake: [
    '    __   ',
    '   /  \\  ',
    '  | °° | ',
    '   \\  /  ',
    '~~~~\\/~~~'
  ],
  unicorn: [
    '    /\\   ',
    '   /  \\  ',
    '  (o  o) ',
    '  /|  |\\ ',
    ' (_|__|_)'
  ],
  wolf: [
    '  /\\ /\\  ',
    ' ( ◉ ◉ ) ',
    '  \\  ▼/  ',
    '  / ⌐ \\  ',
    ' (_/ \\_) '
  ],
  turtle: [
    '     __  ',
    '  .-/  \\-.',
    ' / .---. \\',
    '| | ◦ ◦| |',
    ' \\_\'---\'_/'
  ]
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

function renderBuddy(buddy) {
  const sprite = SPRITES[buddy.species] || SPRITES.slime;
  const shinyTag = buddy.shiny ? ' ✨ SHINY' : '';
  const b = RARITY_BORDER[buddy.rarity] || RARITY_BORDER.common;
  const W = 36;

  function pad(content) {
    const visible = content.replace(/[\u2728\u2605]/g, ' ').length;
    const need = W - 2 - visible;
    return `${b.v} ${content}${' '.repeat(Math.max(0, need))}${b.v}`;
  }

  const lines = [];
  lines.push(`${b.tl}${b.h.repeat(W - 2)}${b.tr}`);
  lines.push(pad(`${(buddy.species || '???').toUpperCase()}${shinyTag}`));
  lines.push(pad(`${RARITY_LABEL[buddy.rarity] || buddy.rarity}`));
  lines.push(pad(``));

  sprite.forEach(l => lines.push(pad(`     ${l}`)));

  lines.push(pad(``));
  lines.push(pad(`Dresseur: @${buddy.handle || '???'}`));
  if (buddy.github) {
    lines.push(pad(`GitHub:   github.com/${buddy.github}`));
  }
  if (buddy.collectedAt) {
    lines.push(pad(`Attrapé:  ${formatDate(buddy.collectedAt)}`));
  }

  if (buddy.eye) lines.push(pad(`Eye: ${buddy.eye}  Hat: ${buddy.hat || '-'}`));

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

module.exports = { SPRITES, renderBuddy, renderPokedex };
