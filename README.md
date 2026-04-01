# 🔬 Claudex

**Le Pokédex de buddies Claude Code — attrapez-les tous !**

Claudex est un plugin pour [Claude Code](https://docs.anthropic.com/en/docs/claude-code) qui te permet de collecter les buddies d'autres utilisateurs dans un Pokédex personnel, et de partager le tien avec la communauté.

## Comment ça marche ?

Chaque utilisateur de Claude Code possède un **buddy** unique (une créature générée de manière déterministe). Avec Claudex, tu peux :

- 🔑 **Créer ton code de partage** — enregistre ton buddy sur le serveur central
- 🎯 **Attraper des buddies** — entre le code de partage d'un autre utilisateur pour ajouter son buddy à ta collection
- 📖 **Consulter ton Claudex** — admire ta collection en ASCII art avec les stats de chaque buddy

## Installation

### 1. Installer le plugin

```bash
git clone https://github.com/DrEggdwarf/Claudex.git
cd Claudex
npm install
```

### 2. Configurer le MCP server

Ajoute ceci à ton fichier `~/.claude/.mcp.json` :

```json
{
  "mcpServers": {
    "claudex": {
      "command": "node",
      "args": ["/chemin/vers/Claudex/mcp-server/index.js"]
    }
  }
}
```

### 3. C'est prêt !

Lance Claude Code et tape `/claudex` pour ouvrir le hub.

## Utilisation

Une seule commande : **`/claudex`**

```
╔══════════════════════════════════════╗
║          🔬 C L A U D E X           ║
║   Pokédex de buddies Claude Code    ║
╠══════════════════════════════════════╣
║                                      ║
║  1. 📖 Consulter mon Claudex        ║
║     Voir ma collection de buddies    ║
║                                      ║
║  2. 🎯 Attraper un buddy            ║
║     Entrer un code de partage        ║
║                                      ║
║  3. 🔑 Mon code de partage          ║
║     Afficher/créer mon code          ║
║                                      ║
╚══════════════════════════════════════╝
```

### Attraper un buddy

1. Demande à un ami son **code de partage**
2. Tape `/claudex` → choisis l'option **2**
3. Entre le code
4. Le buddy est ajouté à ta collection !

### Exemple de buddy dans le Claudex

```
╔══════════════════════════════════════╗
║ DRAGON                      ✨ SHINY║
║ ★ LEGENDARY ★                       ║
║                                      ║
║          /\_                          ║
║         / o >                        ║
║        |  ^  \                       ║
║        /\/\/\  \                     ║
║       |________|                     ║
║                                      ║
║ Dresseur: @robin                     ║
║ GitHub:   github.com/DrEggdwarf     ║
║ Attrapé:  01/04/2026                 ║
║                                      ║
║ DEBUGG   ████████░░ 75               ║
║ PATIENCE ██████░░░░ 60               ║
║ CHAOS    ████░░░░░░ 45               ║
║ WISDOM   ████████░░ 80               ║
╚══════════════════════════════════════╝
```

## Les 18 espèces

| Espèce | Rareté possible |
|--------|----------------|
| 🐱 Cat | Common - Rare |
| 🐶 Dog | Common - Rare |
| 🐰 Rabbit | Common - Uncommon |
| 🐹 Hamster | Common - Uncommon |
| 🐢 Turtle | Common - Rare |
| 🐍 Snake | Uncommon - Epic |
| 🦊 Fox | Uncommon - Epic |
| 🐧 Penguin | Uncommon - Rare |
| 🦉 Owl | Rare - Epic |
| 🐼 Panda | Rare - Epic |
| 🤖 Robot | Rare - Epic |
| 🦄 Unicorn | Rare - Legendary |
| 🐺 Wolf | Rare - Legendary |
| 🐉 Dragon | Epic - Legendary |
| 🔥 Phoenix | Epic - Legendary |
| 👻 Ghost | Epic - Legendary |
| 🫧 Slime | Common - Rare |
| 🦎 Axolotl | Rare - Legendary |

## Architecture

```
claudex/                    ← Plugin Claude Code
├── commands/claudex.md     ← Commande /claudex (hub central)
├── mcp-server/index.js     ← Serveur MCP (bridge vers l'API)
├── lib/
│   ├── storage.js          ← Pokédex local (~/.claudex/pokedex.json)
│   ├── ascii-art.js        ← Rendu ASCII des buddies
│   └── buddy-parser.js     ← Parse les données buddy
└── .mcp.json               ← Config MCP

claudex-server/             ← Serveur central (API REST)
├── index.js                ← Express API
├── db.js                   ← SQLite
├── Dockerfile
└── docker-compose.yml
```

## Contribuer

Les contributions sont les bienvenues ! N'hésite pas à ouvrir une issue ou une PR.

---

*Fait avec 🔬 par la communauté Claude Code*
