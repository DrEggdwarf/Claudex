# Claudex

Pokedex de buddies Claude Code. Collectez-les tous.

Claudex est un outil CLI qui permet aux utilisateurs de Claude Code de partager et collectionner les buddies des autres joueurs, a la maniere d'un Pokedex.

## Installation

Aucune installation requise. Tous les utilisateurs de Claude Code ont Node.js :

```
npx claudex
```

## Utilisation

### Enregistrer son buddy

```
npx claudex
```

Au premier lancement, Claudex te guide pour enregistrer ton buddy :
1. Tape `/buddy` dans Claude Code et copie le resultat
2. Colle-le dans Claudex
3. Choisis ton pseudo de dresseur
4. Recois ton code de partage unique (format `XXXX-XXXX`)

### Attraper un buddy

```
npx claudex catch XXXX-XXXX
```

Entre le code de partage d'un autre dresseur pour ajouter son buddy a ta collection.

### Voir ta collection

```
npx claudex pokedex
```

Affiche tous les buddies collectes avec leurs cartes ASCII, stats et infos.

### Revoir ta carte

```
npx claudex me
```

Affiche ta propre carte de buddy avec ton code de partage.

## Especes

18 especes disponibles :

```
duck      goose     blob      cat       dragon    octopus
owl       penguin   turtle    snail     ghost     axolotl
capybara  cactus    robot     rabbit    mushroom  chonk
```

## Raretes

| Rarete    | Probabilite |
|-----------|-------------|
| Common    | 60%         |
| Uncommon  | 25%         |
| Rare      | 10%         |
| Epic      | 4%          |
| Legendary | 1%          |

Les buddies shiny ont 1% de chance d'apparaitre.

## Exemple de carte

```
+====================================+
| DRAGON "Vortetch"  << SHINY >>     |
| <<< LEGENDARY >>>                  |
+------------------------------------+
|                                    |
|        \^^^/                       |
|       /^\  /^\                     |
|      <  °  °  >                    |
|      (   ~~   )                    |
|       `-vvvv-´                     |
|                                    |
+------------------------------------+
| Dresseur:  @robin                  |
| GitHub:    github.com/DrEggdwarf   |
| Code:      WYHT-KQJG              |
+------------------------------------+
| DEBUGGING ##########... 100        |
| PATIENCE  ########..    85        |
| CHAOS     #####.....    47        |
| WISDOM    ########..    75        |
| SNARK     #######...    68        |
+------------------------------------+
```

## Architecture

```
npx claudex (CLI)          Serveur central (API REST)
  |                              |
  |  register, catch, search     |
  | ---------------------------> |
  |                              |  Express + SQLite
  |  share_code, buddy data      |  Docker sur VPS
  | <--------------------------- |
  |
  v
~/.claudex/pokedex.json (stockage local)
```

## Self-hosting du serveur

Le serveur central tourne dans Docker :

```bash
cd server/
docker compose up -d
```

Variables d'environnement :
- `PORT` — Port du serveur (defaut : 3000)
- `DB_PATH` — Chemin vers la base SQLite (defaut : `/data/claudex.db`)

## API

| Endpoint              | Methode | Description                      |
|-----------------------|---------|----------------------------------|
| `/api/register`       | POST    | Enregistrer un buddy             |
| `/api/buddy/:handle`  | GET     | Recuperer un buddy par pseudo    |
| `/api/catch/:code`    | GET     | Recuperer un buddy par code      |
| `/api/search`         | GET     | Rechercher des buddies           |
| `/api/leaderboard`    | GET     | Top 20 buddies                   |

## Licence

MIT
