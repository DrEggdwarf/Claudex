/**
 * Parse les données buddy depuis la sortie de /buddy.
 * Extrait espèce, rareté, stats, shiny, eye, hat.
 */

function parseBuddyOutput(text) {
  const buddy = {
    species: null,
    rarity: null,
    eye: null,
    hat: null,
    shiny: false,
    stats: {}
  };

  // Espèce — ligne "Species: xxx" ou "Your buddy is a xxx"
  const speciesMatch = text.match(/species:\s*(\w+)/i) || text.match(/buddy is an?\s+(\w+)/i);
  if (speciesMatch) buddy.species = speciesMatch[1].toLowerCase();

  // Rareté
  const rarityMatch = text.match(/rarity:\s*(\w+)/i);
  if (rarityMatch) buddy.rarity = rarityMatch[1].toLowerCase();

  // Shiny
  buddy.shiny = /shiny|✨/i.test(text);

  // Eye
  const eyeMatch = text.match(/eye(?:s)?:\s*(\S+)/i);
  if (eyeMatch) buddy.eye = eyeMatch[1];

  // Hat
  const hatMatch = text.match(/hat:\s*(\S+)/i);
  if (hatMatch) buddy.hat = hatMatch[1];

  // Stats — "STAT_NAME: XX" ou barres
  const statPattern = /(?:^|\s)(DEBUGGING|PATIENCE|CHAOS|WISDOM|SNARK)\s*[:\|]?\s*(\d+)/gi;
  let match;
  while ((match = statPattern.exec(text)) !== null) {
    buddy.stats[match[1].toUpperCase()] = parseInt(match[2], 10);
  }

  return buddy;
}

module.exports = { parseBuddyOutput };
