# Documentation Technique SC Planner

## 1. Documentation de Réalisation

### 1.1 Organisation des Dossiers et Fichiers

#### Frontend (client/)
```
client/
├── app.vue                 # Point d'entrée de l'application
├── assets/                 # Ressources statiques (SCSS, images, icons)
├── components/            
│   ├── base/              # Composants de base réutilisables
│   ├── form/              # Composants de formulaire
│   ├── sections/          # Sections de page
│   └── utils/             # Composants utilitaires
├── layouts/               # Layouts de l'application
├── middleware/            # Middleware Nuxt (auth.global.ts)
├── pages/                # Routes et vues de l'application
├── plugins/              # Plugins (auth, GSAP, Pinia, etc.)
├── public/               # Fichiers publics statiques
├── server/               # API routes côté client
├── stores/               # Stores Pinia (auth, ui)
└── utils/                # Utilitaires (fetcher, windowSize)
```

#### Backend (server/)
```
server/
├── src/
│   ├── auth/             # Authentification et autorisation
│   ├── clients/          # Gestion des clients
│   ├── config/           # Configuration (env, swagger, etc.)
│   ├── database/         # Migrations et seeds
│   ├── email/            # Service d'emails
│   ├── health/           # Healthchecks
│   ├── monitoring/       # Métriques Prometheus
│   ├── projects/         # Gestion des projets
│   ├── tasks/            # Gestion des tâches
│   └── users/            # Gestion des utilisateurs
├── test/                 # Tests unitaires et E2E
└── coverage/             # Rapports de couverture
```

### 1.2 Conventions de Code

#### Frontend
- **Linting**: ESLint avec configuration Nuxt
- **Formatage**: Prettier
- **Style**: 
  - SCSS avec SMACSS (Scalable and Modular Architecture for CSS)
  - Stylelint avec règles standards SCSS
  - Variables et mixins dans `assets/scss`

#### Backend
- **Linting**: ESLint avec TypeScript
- **Formatage**: Prettier
- **Style Guide**: 
  - Conventions NestJS
  - DTOs pour validation des données
  - Interfaces pour les types

### 1.3 Gestion des Dépendances

- Gestionnaire de paquets: `pnpm` (version 10.11.0+)
- Workspaces pour monorepo
- Verrous de versions avec `pnpm-lock.yaml`

#### Principales Dépendances Frontend
```json
{
  "@nuxt/image": "^1.x",
  "@pinia/nuxt": "^0.x",
  "@vueuse/nuxt": "^10.x",
  "nuxt-lucide-icons": "^1.x",
  "@samk-dev/nuxt-vcalendar": "^1.x"
}
```

#### Principales Dépendances Backend
```json
{
  "@nestjs/common": "^11.1.5",
  "@nestjs/swagger": "^11.2.0",
  "@nestjs/typeorm": "^11.0.0",
  "prom-client": "^15.1.3",
  "pg": "^8.16.3"
}
```

### 1.4 Gestion des Tests

#### Tests Backend
- **Tests Unitaires**: Jest
- **Tests E2E**: Jest + Supertest
- **Coverage**: Istanbul
- Seuils de couverture:
  - Tests unitaires: 80%
  - Tests E2E: 70%

#### Configuration des Tests
```javascript
// jest.config.js
{
  collectCoverageFrom: [
    'src/**/*.service.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.e2e-spec.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### 1.5 Bonnes Pratiques

#### Backend
- DTOs pour validation des données entrantes
- Guards pour l'authentification
- Interceptors pour les métriques
- Services pour la logique métier
- Repositories pour l'accès aux données
- Migrations TypeORM pour la base de données

#### Sécurité
- CORS configuré
- JWT avec cookies sécurisés
- Validation des entrées
- Rate limiting
- Hashage des mots de passe avec bcrypt

#### Accessibilité
- Attributs ARIA
- Contraste des couleurs
- Navigation au clavier
- Images avec textes alternatifs

## 2. Documentation d'Utilisation

### 2.1 Prérequis

- Node.js ≥ 20.18.2
- pnpm ≥ 10.11.0
- Docker & Docker Compose
- PostgreSQL ≥ 16

### 2.2 Variables d'Environnement

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/sc_planner
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password

# Frontend (.env)
API_URL=http://localhost:3002/api
```

### 2.3 Commandes Principales

#### Développement
```bash
# Installation des dépendances
pnpm install

# Lancement en développement
pnpm dev:client  # Frontend sur localhost:3000
pnpm dev:server  # Backend sur localhost:3002

# Base de données
pnpm migration:generate
pnpm migration:run
pnpm seed  # Données de test
```

#### Tests
```bash
# Tests unitaires
pnpm test         # Run tests
pnpm test:watch   # Watch mode
pnpm test:cov     # Coverage

# Tests E2E
pnpm test:e2e
pnpm test:e2e:cov

# Tous les tests avec couverture
pnpm test:cov:all
```

### 2.4 Rôles Utilisateurs

1. **Admin**
   - Gestion complète des utilisateurs
   - Accès aux métriques
   - Configuration système

2. **Chef de Projet**
   - Création/gestion de projets
   - Assignment des tâches
   - Rapports et métriques

3. **Membre**
   - Vue des projets assignés
   - Gestion des tâches assignées
   - Mise à jour du statut

4. **Client**
   - Vue de ses projets
   - Suivi de l'avancement
   - Commentaires sur les tâches

### 2.5 API Endpoints

#### Documentation Swagger
```
http://localhost:3002/api/docs
```

#### Endpoints Principaux

1. **Auth**
   - POST /api/auth/login
   - POST /api/auth/register
   - POST /api/auth/refresh
   - POST /api/auth/logout

2. **Projets**
   - GET /api/projects
   - POST /api/projects
   - GET /api/projects/:id
   - PUT /api/projects/:id
   - DELETE /api/projects/:id

3. **Tâches**
   - GET /api/tasks
   - POST /api/tasks
   - PUT /api/tasks/:id
   - PATCH /api/tasks/:id/status
   - DELETE /api/tasks/:id

### 2.6 Monitoring

#### Métriques Prometheus
```
http://localhost:3002/api/metrics
```

#### Dashboards Grafana
- Performance API
- Métriques Node.js
- Métriques PostgreSQL
- Statuts HTTP
- Latence des requêtes

## 3. Documentation de Déploiement

### 3.1 Fichiers Docker Compose

#### Développement (docker-compose.dev.yml)
```yaml
services:
  client:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    volumes:
      - ./client:/app
    ports:
      - "3000:3000"

  server:
    build:
      context: ./server
      dockerfile: Dockerfile.dev
    volumes:
      - ./server:/app
    ports:
      - "3002:3002"

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: sc_planner
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
```

#### Production (docker-compose.prod.yml)
```yaml
services:
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
    ports:
      - "3002:3002"

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
```

### 3.2 Secrets GitHub Actions

- `DOCKERHUB_TOKEN`
- `DOCKERHUB_USERNAME`
- `SSH_PRIVATE_KEY`
- `SSH_HOST`
- `SSH_USER`
- `POSTGRES_PASSWORD`
- `JWT_SECRET`

### 3.3 Pipeline CI/CD

1. **Build & Test**
   - Checkout code
   - Install dependencies
   - Run linting
   - Run tests
   - Build Docker images

2. **Coverage**
   - Upload coverage reports
   - Check coverage thresholds
   - Generate badges

3. **Staging (branche dev)**
   - Push images sur Docker Hub
   - Deploy sur staging
   - Run smoke tests

4. **Production (tags v*)**
   - Create release notes
   - Push images sur Docker Hub
   - Deploy sur production
   - Run health checks

### 3.4 Déploiement Manuel

```bash
# 1. Cloner le repo
git clone https://github.com/ThomasFourties/sc-planner.git
cd sc-planner

# 2. Créer les variables d'environnement
cp .env.example .env

# 3. Build des images
docker compose -f docker-compose.prod.yml build

# 4. Lancer les conteneurs
docker compose -f docker-compose.prod.yml up -d

# 5. Exécuter les migrations
docker compose -f docker-compose.prod.yml exec server pnpm migration:run
```

### 3.5 Procédure de Rollback

1. **Images Docker**
```bash
# Retour à la version précédente
docker compose -f docker-compose.prod.yml down
docker pull thomasfourties/sc-planner-client:v1.1.1
docker pull thomasfourties/sc-planner-server:v1.1.1
docker compose -f docker-compose.prod.yml up -d
```

2. **Base de données**
```bash
# Revert dernière migration
docker compose -f docker-compose.prod.yml exec server pnpm migration:revert
```

### 3.6 Surveillance Post-déploiement

#### Healthchecks
- GET /api/health
- GET /api/health/db
- GET /api/metrics

#### KPIs Critiques
- Taux de succès des requêtes
- Temps de réponse moyen
- Utilisation CPU/Mémoire
- Connexions DB actives
- Erreurs 5xx
