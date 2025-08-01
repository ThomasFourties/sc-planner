// server/src/health/health.controller.ts - VERSION ÉTENDUE

import { Controller, Get, HttpStatus, HttpCode, Header } from '@nestjs/common';
import { HealthService } from './health.service';
import { MonitoringService } from '../monitoring/monitoring.service';
import { HealthCheckResponseDto } from './dto/health-check.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiProduces } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly monitoringService: MonitoringService, // 👈 Injection du service monitoring
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check complet',
    description: "Retourne le statut détaillé de tous les services de l'API",
  })
  @ApiResponse({
    status: 200,
    description: "Statut de santé de l'API",
    type: HealthCheckResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Service indisponible',
  })
  @ApiProduces('application/json')
  async healthCheck(): Promise<HealthCheckResponseDto> {
    const health = await this.healthService.getHealthCheck();

    // 🔥 NOUVEAU : Met à jour les métriques Prometheus avec les données health
    await this.updatePrometheusMetrics(health);

    // Retourner status 503 si unhealthy
    if (health.status === 'unhealthy') {
      throw new Error('Service unhealthy');
    }

    return health;
  }

  // 🔥 NOUVEAU ENDPOINT : /health/metrics pour Prometheus
  @Get('metrics')
  @Header('Content-Type', 'text/plain')
  @ApiOperation({
    summary: 'Métriques Prometheus',
    description: 'Endpoint pour Prometheus avec données health intégrées',
  })
  @ApiProduces('text/plain')
  async getMetrics(): Promise<string> {
    // Récupère les données health et met à jour les métriques
    const health = await this.healthService.getHealthCheck();
    await this.updatePrometheusMetrics(health);

    // Retourne les métriques au format Prometheus
    return this.monitoringService.getMetrics();
  }

  @Get('simple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check simple',
    description: "Vérification rapide de la disponibilité de l'API",
  })
  @ApiResponse({
    status: 200,
    description: 'API disponible',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
      },
    },
  })
  async simpleHealthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.healthService.getSimpleHealth();
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Readiness probe',
    description: "Vérifie si l'API est prête à recevoir du trafic",
  })
  async readinessCheck(): Promise<{ ready: boolean; services: string[] }> {
    const health = await this.healthService.getHealthCheck();

    const criticalServices: string[] = [];
    if (health.database.status === 'healthy') criticalServices.push('database');
    if (health.services.jwt.status === 'healthy') criticalServices.push('jwt');

    return {
      ready: health.status !== 'unhealthy',
      services: criticalServices,
    };
  }

  @Get('live')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liveness probe',
    description: "Vérifie si l'API est vivante (pour Kubernetes)",
  })
  async livenessCheck(): Promise<{ alive: boolean; uptime: number }> {
    return {
      alive: true,
      uptime: Math.floor(process.uptime()),
    };
  }

  // 🔥 MÉTHODE PRIVÉE : Met à jour les métriques Prometheus
  private async updatePrometheusMetrics(health: HealthCheckResponseDto) {
    try {
      // Métriques système
      if (health.system?.memory) {
        this.monitoringService.setMemoryUsage(health.system.memory.percentage);
      }

      if (health.system?.cpu) {
        this.monitoringService.setCpuUsage(health.system.cpu.usage);
      }

      // Métriques base de données
      if (health.database?.responseTime && health.database.responseTime > 0) {
        this.monitoringService.observeDbResponseTime(health.database.responseTime);
      }

      // Statut des services (1 = healthy, 0 = unhealthy)
      this.monitoringService.setServiceStatus('database', health.database?.status === 'healthy' ? 1 : 0);

      this.monitoringService.setServiceStatus('email', health.services?.email?.status === 'healthy' ? 1 : 0);

      this.monitoringService.setServiceStatus('jwt', health.services?.jwt?.status === 'healthy' ? 1 : 0);

      // Statut global
      let overallStatus = 0;
      switch (health.status) {
        case 'healthy':
          overallStatus = 1;
          break;
        case 'degraded':
          overallStatus = 0.5;
          break;
        case 'unhealthy':
          overallStatus = 0;
          break;
      }
      this.monitoringService.setServiceStatus('overall', overallStatus);
    } catch (error) {
      console.error('Error updating Prometheus metrics:', error);
    }
  }
}
