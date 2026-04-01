const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { getPokedex, addBuddy, setHandle } = require('../lib/storage');
const { renderBuddy, renderPokedex } = require('../lib/ascii-art');

const API_BASE = process.env.CLAUDEX_API || 'http://217.69.13.112:3000/api';

const server = new Server(
  { name: 'claudex', version: '0.3.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'claudex_register',
      description: "Enregistre ton buddy sur le serveur Claudex. Crée ton code de partage pour que d'autres puissent attraper ton buddy.",
      inputSchema: {
        type: 'object',
        properties: {
          handle: { type: 'string', description: 'Code de partage choisi (pseudo unique)' },
          species: { type: 'string', description: 'Espèce du buddy' },
          rarity: { type: 'string', description: 'Rareté du buddy' },
          eye: { type: 'string', description: 'Type de yeux' },
          hat: { type: 'string', description: 'Type de chapeau' },
          shiny: { type: 'boolean', description: 'Est-ce un shiny ?' },
          stats: { type: 'object', description: 'Stats du buddy' },
          github: { type: 'string', description: "Nom d'utilisateur GitHub" }
        },
        required: ['handle', 'species', 'rarity']
      }
    },
    {
      name: 'claudex_catch',
      description: "Attrape le buddy d'un autre utilisateur en entrant son code de partage. L'ajoute au Claudex local.",
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: "Code de partage de l'utilisateur cible" }
        },
        required: ['code']
      }
    },
    {
      name: 'claudex_pokedex',
      description: 'Affiche le Claudex local : collection de buddies attrapés en ASCII art + stats.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'claudex_mybuddy',
      description: "Affiche la carte de ton propre buddy tel qu'il est enregistré sur le serveur Claudex.",
      inputSchema: {
        type: 'object',
        properties: {}
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'claudex_register': {
      const { handle, species, rarity, eye, hat, shiny, stats, github } = args;

      try {
        const resp = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle, species, rarity, eye, hat, shiny, stats, github })
        });
        const data = await resp.json();

        if (!resp.ok) {
          return { content: [{ type: 'text', text: `Erreur: ${data.error}` }] };
        }

        setHandle(handle);

        // Afficher la carte du buddy enregistré
        const buddyCard = renderBuddy({
          handle, species, rarity, eye, hat, shiny, stats, github,
          collectedAt: new Date().toISOString()
        });

        return {
          content: [{
            type: 'text',
            text: [
              `✅ Buddy enregistré !`,
              ``,
              buddyCard,
              ``,
              `┌─────────────────────────────┐`,
              `│ 🔑 Ton code de partage :    │`,
              `│                             │`,
              `│   ${handle.padEnd(25)} │`,
              `│                             │`,
              `│ Partage ce code pour que    │`,
              `│ d'autres attrapent ton      │`,
              `│ buddy !                     │`,
              `└─────────────────────────────┘`
            ].join('\n')
          }]
        };
      } catch (e) {
        return { content: [{ type: 'text', text: `Erreur de connexion au serveur: ${e.message}` }] };
      }
    }

    case 'claudex_catch': {
      const { code } = args;

      try {
        const resp = await fetch(`${API_BASE}/buddy/${encodeURIComponent(code)}`);
        const buddy = await resp.json();

        if (!resp.ok) {
          return { content: [{ type: 'text', text: `Aucun buddy trouvé pour le code "${code}". Vérifie le code de partage !` }] };
        }

        buddy.handle = code;
        const result = addBuddy(buddy);

        const art = renderBuddy({ ...buddy, collectedAt: result.added ? result.entry.collectedAt : buddy.collectedAt });

        if (!result.added) {
          return {
            content: [{
              type: 'text',
              text: `Tu as déjà attrapé le buddy de ${code} !\n\n${art}`
            }]
          };
        }

        return {
          content: [{
            type: 'text',
            text: `🎉 Buddy attrapé !\n\n${art}\n\n📖 Total dans ton Claudex: ${result.pokedex.stats.total}`
          }]
        };
      } catch (e) {
        return { content: [{ type: 'text', text: `Erreur de connexion au serveur: ${e.message}` }] };
      }
    }

    case 'claudex_pokedex': {
      const pokedex = getPokedex();
      const art = renderPokedex(pokedex.collected);

      const statsLines = [];
      if (pokedex.myHandle) {
        statsLines.push(`🔑 Mon code: ${pokedex.myHandle}`);
      } else {
        statsLines.push(`⚠️  Pas encore enregistré — choisis l'option 4 pour créer ton code de partage`);
      }
      statsLines.push(`📖 Total attrapé: ${pokedex.stats.total}`);
      if (pokedex.stats.shinies > 0) statsLines.push(`✨ Shinies: ${pokedex.stats.shinies}`);

      if (Object.keys(pokedex.stats.byRarity).length > 0) {
        statsLines.push('');
        statsLines.push('Par rareté:');
        for (const [rarity, count] of Object.entries(pokedex.stats.byRarity)) {
          statsLines.push(`  ${rarity}: ${count}`);
        }
      }

      return {
        content: [{
          type: 'text',
          text: `${art}\n\n${statsLines.join('\n')}`
        }]
      };
    }

    case 'claudex_mybuddy': {
      const pokedex = getPokedex();

      if (!pokedex.myHandle) {
        return {
          content: [{
            type: 'text',
            text: `⚠️ Tu n'es pas encore enregistré !\n\nUtilise /claudex → option 4 pour enregistrer ton buddy et obtenir ton code de partage.`
          }]
        };
      }

      try {
        const resp = await fetch(`${API_BASE}/buddy/${encodeURIComponent(pokedex.myHandle)}`);
        const buddy = await resp.json();

        if (!resp.ok) {
          return { content: [{ type: 'text', text: `Impossible de récupérer ton buddy depuis le serveur.` }] };
        }

        buddy.handle = pokedex.myHandle;
        const art = renderBuddy(buddy);

        return {
          content: [{
            type: 'text',
            text: [
              `🔬 Voici ton buddy :`,
              ``,
              art,
              ``,
              `🔑 Code de partage: ${pokedex.myHandle}`
            ].join('\n')
          }]
        };
      } catch (e) {
        return { content: [{ type: 'text', text: `Erreur de connexion au serveur: ${e.message}` }] };
      }
    }

    default:
      return { content: [{ type: 'text', text: `Tool inconnu: ${name}` }] };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
