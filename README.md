# Starter Nuxt avec NestJS et PostgreSQL 🚀
Ce projet est un starter pour initier des projets avec Nuxt en front-end, NestJS en back-end et PostgreSQL comme base de données. Il permet de démarrer rapidement avec une configuration Docker prête à l'emploi pour le développement local.

## Technologies utilisées 🛠️

- **Nuxt.js** (Frontend) 🌐
- **NestJS** (Backend) 💻
- **PostgreSQL** (Base de données) 🗄️
- **Docker** (Pour la gestion des conteneurs) 🐳
- **PNPM** (Gestionnaire de paquets) 📦

## Prérequis

- **Docker** 🐳
- **Docker Compose** ⚙️
- Une version de **Node.js** >= 20.18.2 🔧
- Une base de données **PostgreSQL** (conteneurisée dans ce projet) 🗄️

## Installation

1. **Clonez le projet :**

```bash
git clone https://github.com/ThomasFourties/sc-planner.git
```
2. **Remplir les variables d'environnement** 

Créez un fichier `.env` à la racine du projet et remplissez les informations suivantes :


```bash
# Client
API_URL=http://localhost:3001
API_AUTH_TOKEN=<votre_token_authentification>

# Server
DATABASE_URL=postgres://<user>:<password>@database:5432/<dbname>
DATABASE_HOST=database
DATABASE_PORT=5432
DATABASE_USER=<user>
DATABASE_PASSWORD=<password>
DATABASE_NAME=<dbname>
```

3. Construisez les images Docker :
```bash
docker-compose build
```

## Structure du projet

```bash
.
├── client                # Frontend Nuxt.js
│   ├── assets            # Ressources statiques
│   ├── components        # Composants Vue.js
│   ├── pages             # Pages de l'application
│   ├── plugins           # Plugins Nuxt.js
│   ├── nuxt.config.ts    # Configuration Nuxt.js
│   └── package.json      # Dépendances frontend
├── server                # Backend NestJS
│   ├── src               # Code source
│   ├── controllers       # Contrôleurs NestJS
│   ├── services          # Services NestJS
│   ├── entities          # Entités TypeORM
│   ├── tsconfig.json     # Configuration TypeScript
│   └── package.json      # Dépendances backend
├── docker-compose.yml    # Configuration Docker Compose
└── .env                  # Variables d'environnement
```

## Utilisation

Lancez les conteneurs Docker :

```bash
docker-compose up -d
```
Ce script va démarrer les services suivants :

- Client sur le port 3000 (Nuxt.js)

- Server sur le port 3001 (NestJS)

- Database sur le port 5432 (PostgreSQL)

Accédez à l'application :

- Frontend : http://localhost:3000

- Backend : http://localhost:3001

## 📝 Changelog et Versioning

Ce projet utilise un système de changelog automatique basé sur les [Conventional Commits](https://conventionalcommits.org/). 

- **Changelog automatique** généré à chaque push sur `master`
- **Versioning sémantique** (semver) automatique
- **Releases GitHub** automatiques

### Format des commits

```bash
feat: add new feature      # → version minor (0.1.0 → 0.2.0)
fix: resolve bug           # → version patch (0.1.0 → 0.1.1)
feat!: breaking change     # → version major (0.1.0 → 1.0.0)
```

📚 **Guide complet** : [docs/CHANGELOG_GUIDE.md](docs/CHANGELOG_GUIDE.md)

## 📋 Scripts disponibles

```bash
# Développement
npm run dev                # Lancer en mode développement
npm run build             # Construire les images Docker
npm run logs              # Voir les logs des conteneurs
```

## Processus de Release

### Prérequis
1. Assurez-vous d'avoir un token GitHub avec accès au repo
2. Définissez le token dans votre environnement :
   ```bash
   export GITHUB_TOKEN=votre_token_ici
   ```

### Étapes pour Créer une Release

1. **Créer la Release**
   ```bash
   pnpm release <version>
   ```
   Exemple : `pnpm release 0.3.0`

   Cela va :
   - Vérifier si le tag de version existe déjà
   - Mettre à jour la version dans tous les fichiers package.json
   - Générer/mettre à jour le CHANGELOG.md
   - Créer un commit git et un tag
   - Créer une release GitHub avec le contenu du changelog

2. **Pousser les Changements**
   ```bash
   git push --follow-tags origin master
   ```

### Dépannage

Si vous obtenez une erreur concernant un tag existant :
1. Supprimer le tag local :
   ```bash
   git tag -d v<version>
   ```
2. Supprimer le tag distant :
   ```bash
   git push origin :refs/tags/v<version>
   ```
3. Réessayer le processus de release

### Format de Version
- Utiliser le versioning sémantique : `x.y.z`
- Exemples : `0.1.0`, `1.0.0`, `2.1.3`