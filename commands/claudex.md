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
║  1. 📖 Mon Claudex                  ║
║     Voir ma collection de buddies    ║
║                                      ║
║  2. 🎯 Attraper un buddy            ║
║     Entrer un code de partage        ║
║                                      ║
║  3. 🔬 Voir mon buddy               ║
║     Afficher ma carte de buddy       ║
║                                      ║
║  4. 🔑 Mon code de partage          ║
║     Afficher/créer mon code          ║
║                                      ║
╚══════════════════════════════════════╝
```

Attends la réponse de l'utilisateur (1, 2, 3 ou 4) puis exécute l'action correspondante :

### Option 1 — Mon Claudex
Utilise le tool MCP `claudex_pokedex` pour afficher la collection locale en ASCII art avec les stats.

### Option 2 — Attraper un buddy
Demande à l'utilisateur d'entrer le **code de partage** (handle) du buddy à attraper.
Puis utilise le tool MCP `claudex_catch` avec le code fourni.
Affiche le buddy attrapé en ASCII art.

### Option 3 — Voir mon buddy
Utilise le tool MCP `claudex_mybuddy` pour afficher la carte du buddy de l'utilisateur tel qu'il est enregistré sur le serveur.
Si l'utilisateur n'est pas encore enregistré, suggère-lui l'option 4.

### Option 4 — Mon code de partage
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

- **Si pas encore enregistré** : demande à l'utilisateur de choisir un pseudo (son code de partage), et optionnellement son pseudo GitHub.
  Puis exécute `/buddy` pour récupérer les données de son buddy.
  Parse les données (espèce, rareté, stats, shiny, eye, hat).
  Utilise le tool MCP `claudex_register` pour l'enregistrer sur le serveur (avec le github si fourni).
  Affiche sa carte de buddy et son code de partage une fois enregistré.
