# API de Monitoring - SC Planner

## Endpoints disponibles

### `/health` - Health Check Basique
**Méthode:** `GET`
**Description:** Vérification rapide de la santé de l'application et de la base de données.

**Réponse:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### `/metrics` - Métriques Complètes
**Méthode:** `GET`
**Description:** Métriques détaillées pour le monitoring avancé de l'application.

**Réponse complète:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "version": "0.4.0",
  "environment": "production",
  "database": {
    "status": "connected",
    "latency": 15,
    "connections": 5
  },
  "users": {
    "total": 150,
    "byRole": {
      "CLIENT": 80,
      "SALARIE": 40,
      "CHEF_DE_PROJET": 20,
      "FREELANCE": 10
    },
    "recentRegistrations": 5
  },
  "tasks": {
    "total": 500,
    "byStatus": {
      "TODO": 120,
      "IN_PROGRESS": 80,
      "DONE": 280,
      "NOT_STARTED": 15,
      "BLOCKED": 5
    },
    "byPriority": {
      "LOW": 200,
      "MEDIUM": 250,
      "HIGH": 50
    },
    "completionRate": 56.0
  },
  "system": {
    "memory": {
      "used": 128.5,
      "total": 512.0,
      "percentage": 25.1
    },
    "cpu": {
      "usage": 15.2
    }
  },
  "services": {
    "email": {
      "status": "healthy",
      "configured": true
    },
    "auth": {
      "status": "healthy"
    }
  }
}
```

## Métriques surveillées

### 🗄️ **Base de données**
- **Status:** Connexion active/inactive
- **Latency:** Temps de réponse en millisecondes
- **Connections:** Nombre de connexions actives

### 👥 **Utilisateurs**
- **Total:** Nombre total d'utilisateurs
- **Par rôle:** Répartition par CLIENT, SALARIE, CHEF_DE_PROJET, FREELANCE
- **Inscriptions récentes:** Nouveaux utilisateurs dans les dernières 24h

### 📋 **Tâches**
- **Total:** Nombre total de tâches
- **Par statut:** TODO, IN_PROGRESS, DONE, NOT_STARTED, BLOCKED
- **Par priorité:** LOW, MEDIUM, HIGH
- **Taux de completion:** Pourcentage de tâches terminées

### 🖥️ **Système**
- **Mémoire:** Usage et pourcentage d'utilisation
- **CPU:** Pourcentage d'utilisation

### 🔧 **Services**
- **Email:** Status et configuration
- **Auth:** Status du service d'authentification

## Utilisation avec les outils de monitoring

### Prometheus
Vous pouvez exposer ces métriques à Prometheus en créant un adaptateur :

```typescript
// Exemple d'exposition pour Prometheus
app.get('/metrics/prometheus', async (req, res) => {
  const metrics = await healthService.getMetrics();
  
  let prometheus = '';
  prometheus += `# HELP app_uptime_seconds Application uptime in seconds\n`;
  prometheus += `# TYPE app_uptime_seconds counter\n`;
  prometheus += `app_uptime_seconds ${metrics.uptime}\n\n`;
  
  prometheus += `# HELP db_latency_milliseconds Database latency in milliseconds\n`;
  prometheus += `# TYPE db_latency_milliseconds gauge\n`;
  prometheus += `db_latency_milliseconds ${metrics.database.latency}\n\n`;
  
  // ... autres métriques
  
  res.set('Content-Type', 'text/plain');
  res.send(prometheus);
});
```

### Grafana Dashboard
Créez un dashboard Grafana qui interroge régulièrement `/metrics` pour afficher :
- Graphiques de latence DB
- Évolution du nombre d'utilisateurs
- Taux de completion des tâches
- Usage système (CPU/RAM)

### Alerting
Configurez des alertes basées sur :
- `database.status != "connected"`
- `database.latency > 1000`
- `system.memory.percentage > 90`
- `system.cpu.usage > 80`
- `services.auth.status != "healthy"`

## Codes de statut

| Status | Description |
|--------|-------------|
| `healthy` | Tous les services fonctionnent normalement |
| `unhealthy` | Un ou plusieurs services rencontrent des problèmes |

## Variables d'environnement requises

Pour un monitoring optimal, assurez-vous que ces variables sont configurées :

```env
# Base de données
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=sc-planner-db

# Email (optionnel pour le status)
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password

# JWT (requis)
JWT_SECRET=your-jwt-secret-key

# Application
NODE_ENV=production
```

## Sécurité

⚠️ **Important:** Ces endpoints contiennent des informations sensibles sur votre infrastructure. Assurez-vous de :

1. Restreindre l'accès à ces endpoints dans votre reverse proxy
2. Utiliser HTTPS en production
3. Considérer l'ajout d'une authentification pour `/metrics`
4. Ne pas exposer ces endpoints publiquement

Exemple de configuration Nginx :
```nginx
location /metrics {
    allow 10.0.0.0/8;     # Réseau privé
    allow 172.16.0.0/12;  # Docker networks
    deny all;
    proxy_pass http://backend;
}
``` 