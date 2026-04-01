const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { getPokedex, addBuddy, setHandle, setShareCode } = require('../lib/storage');
const { renderBuddy, renderPokedex } = require('../lib/ascii-art');

const API_BASE = process.env.CLAUDEX_API || 'http://217.69.13.112:3000/api';

const server = new Server(
  { name: 'claudex', version: '0.5.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'claudex_register',
      description: "Enregistre ton buddy sur le serveur Claudex. Un code de partage unique est genere automatiquement.",
      inputSchema: {
        type: 'object',
        properties: {
          handle: { type: 'string', description: 'Pseudo du dresseur' },
          species: { type: 'string', description: 'Espece du buddy' },
          rarity: { type: 'string', description: 'Rarete du buddy' },
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
      description: "Attrape le buddy d'un autre utilisateur en entrant son code de partage (format XXXX-XXXX).",
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: "Code de partage (format XXXX-XXXX)" }
        },
        required: ['code']
      }
    },
    {
      name: 'claudex_pokedex',
      description: 'Affiche le Claudex local : collection de buddies attrapes.',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    },
    {
      name: 'claudex_mybuddy',
      description: "Affiche la carte de ton propre buddy et ton code de partage.",
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
        setShareCode(data.share_code);

        const buddyCard = renderBuddy({
          handle, species, rarity, eye, hat, shiny, stats, github,
          share_code: data.share_code,
          collectedAt: new Date().toISOString()
        });

        return {
          content: [{
            type: 'text',
            text: [
              `Buddy enregistre !`,
              ``,
              buddyCard,
              ``,
              `+-----------------------------+`,
              `| TON CODE DE PARTAGE :       |`,
              `|                             |`,
              `|     ${data.share_code.padEnd(23)} |`,
              `|                             |`,
              `| Partage ce code pour que    |`,
              `| d'autres attrapent ton      |`,
              `| buddy.                      |`,
              `+-----------------------------+`
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
        const resp = await fetch(`${API_BASE}/catch/${encodeURIComponent(code.toUpperCase().trim())}`);
        const buddy = await resp.json();

        if (!resp.ok) {
          return { content: [{ type: 'text', text: `Code "${code}" invalide. Verifie le code de partage (format XXXX-XXXX).` }] };
        }

        const result = addBuddy(buddy);

        const art = renderBuddy({
          ...buddy,
          collectedAt: result.added ? result.entry.collectedAt : (buddy.collectedAt || new Date().toISOString())
        });

        if (!result.added) {
          return {
            content: [{
              type: 'text',
              text: `Deja dans ton Claudex !\n\n${art}`
            }]
          };
        }

        return {
          content: [{
            type: 'text',
            text: `Nouveau buddy attrape !\n\n${art}\n\nTotal dans ton Claudex: ${result.pokedex.stats.total}`
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
        statsLines.push(`Dresseur: ${pokedex.myHandle}`);
      }
      if (pokedex.shareCode) {
        statsLines.push(`Code: ${pokedex.shareCode}`);
      }
      if (!pokedex.myHandle) {
        statsLines.push(`Non enregistre -- /claudex > option 4`);
      }
      statsLines.push(`Total: ${pokedex.stats.total}`);
      if (pokedex.stats.shinies > 0) statsLines.push(`Shinies: ${pokedex.stats.shinies}`);

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
            text: `Non enregistre. Utilise /claudex > option 4 pour enregistrer ton buddy.`
          }]
        };
      }

      try {
        const resp = await fetch(`${API_BASE}/buddy/${encodeURIComponent(pokedex.myHandle)}`);
        const buddy = await resp.json();

        if (!resp.ok) {
          return { content: [{ type: 'text', text: `Impossible de recuperer ton buddy.` }] };
        }

        const art = renderBuddy(buddy);

        return {
          content: [{
            type: 'text',
            text: [
              `Ton buddy :`,
              ``,
              art,
              ``,
              `Code de partage: ${buddy.share_code || pokedex.shareCode || '???'}`
            ].join('\n')
          }]
        };
      } catch (e) {
        return { content: [{ type: 'text', text: `Erreur de connexion: ${e.message}` }] };
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
