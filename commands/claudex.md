# /claudex

Hub central de Claudex — le Pokédex de buddies Claude Code.

## Instructions

Quand l'utilisateur tape `/claudex`, affiche ce menu et demande-lui ce qu'il veut faire :

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

Attends la réponse de l'utilisateur (1, 2 ou 3) puis exécute l'action correspondante :

### Option 1 — Consulter mon Claudex
Utilise le tool MCP `claudex_pokedex` pour afficher la collection locale en ASCII art avec les stats.

### Option 2 — Attraper un buddy
Demande à l'utilisateur d'entrer le **code de partage** (handle) du buddy à attraper.
Puis utilise le tool MCP `claudex_catch` avec le code fourni.
Affiche le buddy attrapé en ASCII art.

### Option 3 — Mon code de partage
Vérifie si l'utilisateur est déjà enregistré (via `claudex_pokedex`, regarde le champ `myHandle`).

- **Si déjà enregistré** : affiche son code de partage dans un encadré :
  ```
  ┌─────────────────────────────┐
  │ 🔑 Ton code de partage :   │
  │                             │
  │   robin                     │
  │                             │
  │ Partage ce code pour que    │
  │ d'autres attrapent ton      │
  │ buddy !                     │
  └─────────────────────────────┘
  ```

- **Si pas encore enregistré** : demande à l'utilisateur de choisir un pseudo (son code de partage).
  Puis exécute `/buddy` pour récupérer les données de son buddy.
  Parse les données (espèce, rareté, stats, shiny, eye, hat).
  Utilise le tool MCP `claudex_register` pour l'enregistrer sur le serveur.
  Affiche son code de partage une fois enregistré.
