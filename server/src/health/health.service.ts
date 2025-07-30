import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import {
  HealthCheckResponseDto,
  DatabaseHealthDto,
  SystemHealthDto,
  ServicesHealthDto,
} from './dto/health-check.dto';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async getHealthCheck(): Promise<HealthCheckResponseDto> {
    this.logger.log('Executing health check...');

    const [database, system, services, endpoints] = await Promise.all([
      this.checkDatabase(),
      this.checkSystem(),
      this.checkServices(),
      this.checkEndpoints(),
    ]);

    const overallStatus = this.determineOverallStatus(
      database,
      services,
      endpoints,
    );

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      database,
      system,
      services,
      endpoints,
    };
  }

  private async checkDatabase(): Promise<DatabaseHealthDto> {
    try {
      const startTime = Date.now();

      // Test simple query
      await this.userRepository.query('SELECT 1');

      const responseTime = Date.now() - startTime;

      // Test avec une vraie requête
      const userCount = await this.userRepository.count();

      return {
        status: 'healthy',
        connection: true,
        responseTime,
        message: `Database connected. ${userCount} users in system.`,
      };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        connection: false,
        responseTime: -1,
        message: `Database connection failed: ${error.message}`,
      };
    }
  }

  private checkSystem(): SystemHealthDto {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);

    return {
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: memoryPercentage,
      },
      cpu: {
        usage: Math.round(process.cpuUsage().user / 1000000), // Approximation
      },
    };
  }

  private async checkServices(): Promise<ServicesHealthDto> {
    const emailHealth = await this.checkEmailService();
    const jwtHealth = this.checkJwtService();

    return {
      email: emailHealth,
      jwt: jwtHealth,
    };
  }

  private async checkEmailService(): Promise<{
    status: 'healthy' | 'unhealthy';
    configured: boolean;
    message?: string;
  }> {
    try {
      const isConfigured = !!(
        process.env.EMAIL_HOST &&
        process.env.EMAIL_PORT &&
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS
      );

      if (!isConfigured) {
        return {
          status: 'unhealthy',
          configured: false,
          message: 'Email service not configured',
        };
      }

      return {
        status: 'healthy',
        configured: true,
        message: 'Email service configured and ready',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        configured: true,
        message: `Email service error: ${error.message}`,
      };
    }
  }

  private checkJwtService(): {
    status: 'healthy' | 'unhealthy';
    configured: boolean;
    message?: string;
  } {
    try {
      const isConfigured = !!process.env.JWT_SECRET;

      if (!isConfigured) {
        return {
          status: 'unhealthy',
          configured: false,
          message: 'JWT secret not configured',
        };
      }

      // Test JWT generation
      const testPayload = { test: true };
      const token = this.jwtService.sign(testPayload, { expiresIn: '1s' });
      const decoded = this.jwtService.verify(token);

      if (decoded.test) {
        return {
          status: 'healthy',
          configured: true,
          message: 'JWT service working correctly',
        };
      }

      return {
        status: 'unhealthy',
        configured: true,
        message: 'JWT verification failed',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        configured: true,
        message: `JWT service error: ${error.message}`,
      };
    }
  }

  private async checkEndpoints(): Promise<{
    auth: boolean;
    users: boolean;
    clients: boolean;
    projects: boolean;
    tasks: boolean;
  }> {
    // Simulation de vérification des endpoints
    // En production, vous pourriez faire des requêtes internes
    return {
      auth: true,
      users: true,
      clients: true,
      projects: true,
      tasks: true,
    };
  }

  private determineOverallStatus(
    database: DatabaseHealthDto,
    services: ServicesHealthDto,
    endpoints: any,
  ): 'healthy' | 'unhealthy' | 'degraded' {
    const critical = [database.status];
    const important = [services.jwt.status];
    const optional = [services.email.status];

    // Si un service critique est down
    if (critical.some((status) => status === 'unhealthy')) {
      return 'unhealthy';
    }

    // Si un service important est down
    if (important.some((status) => status === 'unhealthy')) {
      return 'degraded';
    }

    // Si seulement les services optionnels sont down
    if (optional.some((status) => status === 'unhealthy')) {
      return 'degraded';
    }

    return 'healthy';
  }

  async getSimpleHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      await this.userRepository.query('SELECT 1');
      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Health check failed');
    }
  }
}
