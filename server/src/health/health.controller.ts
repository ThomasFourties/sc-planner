import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthCheckResponseDto } from './dto/health-check.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProduces,
} from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

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

    // Retourner status 503 si unhealthy
    if (health.status === 'unhealthy') {
      throw new Error('Service unhealthy');
    }

    return health;
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
}
