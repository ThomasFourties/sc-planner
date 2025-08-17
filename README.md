# SC Planner

## Système de gestion de projets et planification des tâches

SC Planner est un outil professionnel de gestion de projet et de planification de tâches, conçu pour l'agence Supercolor. L'application facilite la collaboration entre les chefs de projet, les équipes internes et les clients.

## ✨ Fonctionnalités principales

- 📊 Tableau de bord personnalisé
- 📅 Planification et suivi des projets
- ✔️ Gestion des tâches avec statuts
- 👥 Gestion des équipes et clients
- 📈 Métriques et reporting

## 🛠️ Stack technique

### Frontend
- **Framework**: Nuxt.js 4
- **State Management**: Pinia
- **UI/UX**: SCSS + TailwindCSS
- **Composants**: Vue 3
- **Animations**: GSAP

### Backend
- **Framework**: NestJS
- **ORM**: TypeORM
- **Base de données**: PostgreSQL
- **API**: REST + Swagger
- **Auth**: JWT + Cookies

### DevOps
- **Conteneurisation**: Docker + Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

## 🚦 Qualité & Tests

- **Linting**: ESLint + StyleLint
- **Formatting**: Prettier
- **Tests unitaires**: Jest
- **Tests E2E**: Jest + Supertest
- **Coverage**: >80% 

## 📦 Installation

### Prérequis
- Node.js ≥ 20.18.2
- pnpm ≥ 10.11.0
- Docker + Docker Compose

### Développement

```bash
# Installation des dépendances
pnpm install

# Lancement des services
docker compose -f docker-compose.dev.yml up -d

# Frontend (http://localhost:3000)
cd client && pnpm dev

# Backend (http://localhost:3002)
cd server && pnpm start:dev
```

### Production

```bash
# Build & démarrage
docker compose -f docker-compose.prod.yml up -d --build

# Migration base de données
docker compose -f docker-compose.prod.yml exec server pnpm migration:run
```

## 📚 Documentation

- [Documentation technique](./docs/TECHNICAL.md)
- [Guide des releases](./docs/CHANGELOG_GUIDE.md)
- [API Swagger](http://localhost:3002/api/docs)
- [Métriques](http://localhost:3002/api/metrics)

## 🔑 Configuration initiale

1. **Variables d'environnement**

   Copiez le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

   Modifiez les variables selon votre environnement :

   ```bash
   # Base de données (requis)
   DATABASE_HOST=localhost        # Hôte de la base de données
   DATABASE_PORT=5432            # Port PostgreSQL (par défaut: 5432)
   DATABASE_USER=your_user       # Nom d'utilisateur
   DATABASE_PASSWORD=your_pass    # Mot de passe
   DATABASE_NAME=sc_planner      # Nom de la base de données

   DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}

   # JWT (requis)
   JWT_SECRET=your-secret-key    # Clé secrète pour les tokens JWT

   # Email SMTP (optionnel en développement)
   EMAIL_HOST=smtp.example.com    # Serveur SMTP
   EMAIL_PORT=587                 # Port SMTP
   EMAIL_USER=your_email         # Adresse email
   EMAIL_PASS=your_pass          # Mot de passe
   EMAIL_SECURE=false            # true pour SSL/TLS

   # URLs et environnement
   FRONTEND_URL=http://localhost:3000  # URL du frontend
   NODE_ENV=development                # development ou production
   API_URL=http://server:3002/api      # URL de l'API

   # Github Token (optionnel en développement)
   GITHUB_TOKEN=your-github-token
   ```

2. **Ports des services**
   
   Si vous avez besoin de modifier les ports par défaut, ajustez-les dans les fichiers Docker Compose :
   - `docker-compose.dev.yml` pour le développement
   - `docker-compose.prod.yml` pour la production

   Ports par défaut :
   - Frontend : 3000
   - Backend : 3002
   - PostgreSQL : 5432
   - Prometheus : 9090
   - Grafana : 3000

## 📈 Monitoring

- **Métriques**: http://localhost:3002/api/metrics
- **Grafana**: http://localhost:3000/grafana
- **Prometheus**: http://localhost:9090

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'feat: add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

Copyright © 2025 [Thomas Fourties](https://github.com/ThomasFourties).

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