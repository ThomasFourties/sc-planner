import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService, MetricsResponse } from './health.service';

@ApiTags('Monitoring')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  @ApiOperation({ summary: "Vérification de santé basique de l'application" })
  @ApiResponse({
    status: 200,
    description: "Statut de santé de l'application",
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        database: { type: 'string', example: 'connected' },
      },
    },
  })
  async check() {
    return this.healthService.basicHealthCheck();
  }

  @Get('metrics')
  @ApiOperation({
    summary: "Métriques complètes de monitoring de l'application",
  })
  @ApiResponse({
    status: 200,
    description: "Métriques détaillées de l'application pour le monitoring",
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['healthy', 'unhealthy'],
          example: 'healthy',
        },
        timestamp: {
          type: 'string',
          example: '2024-01-01T00:00:00.000Z',
        },
        uptime: {
          type: 'number',
          example: 3600,
          description: 'Temps de fonctionnement en secondes',
        },
        version: {
          type: 'string',
          example: '0.4.0',
        },
        environment: {
          type: 'string',
          example: 'production',
        },
        database: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['connected', 'disconnected'] },
            latency: {
              type: 'number',
              description: 'Latence en millisecondes',
            },
            connections: {
              type: 'number',
              description: 'Nombre de connexions actives',
            },
          },
        },
        users: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              description: "Nombre total d'utilisateurs",
            },
            byRole: {
              type: 'object',
              description: 'Répartition par rôle',
            },
            recentRegistrations: {
              type: 'number',
              description: 'Inscriptions dans les dernières 24h',
            },
          },
        },
        tasks: {
          type: 'object',
          properties: {
            total: { type: 'number', description: 'Nombre total de tâches' },
            byStatus: {
              type: 'object',
              description: 'Répartition par statut',
            },
            byPriority: {
              type: 'object',
              description: 'Répartition par priorité',
            },
            completionRate: {
              type: 'number',
              description: 'Taux de completion en pourcentage',
            },
          },
        },
        system: {
          type: 'object',
          properties: {
            memory: {
              type: 'object',
              properties: {
                used: { type: 'number', description: 'Mémoire utilisée en MB' },
                total: { type: 'number', description: 'Mémoire totale en MB' },
                percentage: {
                  type: 'number',
                  description: "Pourcentage d'utilisation",
                },
              },
            },
            cpu: {
              type: 'object',
              properties: {
                usage: {
                  type: 'number',
                  description: 'Utilisation CPU en pourcentage',
                },
              },
            },
          },
        },
        services: {
          type: 'object',
          properties: {
            email: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['healthy', 'unhealthy'] },
                configured: {
                  type: 'boolean',
                  description: 'Service configuré',
                },
              },
            },
            auth: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['healthy', 'unhealthy'] },
              },
            },
          },
        },
      },
    },
  })
  async getMetrics(): Promise<MetricsResponse> {
    return this.healthService.getMetrics();
  }
}
