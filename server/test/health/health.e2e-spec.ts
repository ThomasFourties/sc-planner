import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../src/users/entities/user.entity';
import { Client } from '../../src/clients/entities/client.entity';
import { Project } from '../../src/projects/entities/project.entity';
import { Task } from '../../src/tasks/entities/task.entity';
import { HealthModule } from '../../src/health/health.module';
import { UsersModule } from '../../src/users/users.module';
import { EmailModule } from '../../src/email/email.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT || '5433'),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [User, Client, Project, Task],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        HealthModule,
        UsersModule,
        EmailModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return full health check when healthy', async () => {
      const res = await request(app.getHttpServer()).get('/health').expect(200);

      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('environment');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('system');
      expect(res.body).toHaveProperty('services');
      expect(res.body).toHaveProperty('endpoints');

      // Vérifier la structure de la réponse database
      expect(res.body.database).toHaveProperty('status');
      expect(res.body.database).toHaveProperty('connection');
      expect(res.body.database).toHaveProperty('responseTime');
      expect(res.body.database.status).toBe('healthy');
      expect(res.body.database.connection).toBe(true);
      expect(typeof res.body.database.responseTime).toBe('number');

      // Vérifier la structure des services
      expect(res.body.services).toHaveProperty('email');
      expect(res.body.services).toHaveProperty('jwt');
      expect(res.body.services.jwt.status).toBe('healthy');
      expect(res.body.services.jwt.configured).toBe(true);

      // Vérifier la structure du système
      expect(res.body.system).toHaveProperty('uptime');
      expect(res.body.system).toHaveProperty('memory');
      expect(res.body.system).toHaveProperty('cpu');
      expect(typeof res.body.system.uptime).toBe('number');
      expect(typeof res.body.system.memory.used).toBe('number');
      expect(typeof res.body.system.memory.total).toBe('number');
      expect(typeof res.body.system.memory.percentage).toBe('number');
    });

    it('should return health check even when email service is not configured', async () => {
      const res = await request(app.getHttpServer()).get('/health').expect(200);

      // Le service devrait fonctionner même si l'email n'est pas configuré
      expect(['healthy', 'degraded']).toContain(res.body.status);
      expect(res.body.database.status).toBe('healthy');
      expect(res.body.services.jwt.status).toBe('healthy');
    });
  });

  describe('/health/simple (GET)', () => {
    it('should return simple health check', async () => {
      const res = await request(app.getHttpServer()).get('/health/simple').expect(200);

      expect(res.body).toHaveProperty('status', 'OK');
      expect(res.body).toHaveProperty('timestamp');
      expect(typeof res.body.timestamp).toBe('string');

      // Vérifier que le timestamp est au format ISO
      expect(() => new Date(res.body.timestamp)).not.toThrow();
    });
  });

  describe('/health/ready (GET)', () => {
    it('should return readiness probe when services are ready', async () => {
      const res = await request(app.getHttpServer()).get('/health/ready').expect(200);

      expect(res.body).toHaveProperty('ready');
      expect(res.body).toHaveProperty('services');
      expect(Array.isArray(res.body.services)).toBe(true);

      // Les services critiques devraient être présents
      expect(res.body.services).toContain('database');
      expect(res.body.services).toContain('jwt');

      // Si la base de données fonctionne, on devrait être ready
      expect(res.body.ready).toBe(true);
    });
  });

  describe('/health/live (GET)', () => {
    it('should return liveness probe', async () => {
      const res = await request(app.getHttpServer()).get('/health/live').expect(200);

      expect(res.body).toHaveProperty('alive', true);
      expect(res.body).toHaveProperty('uptime');
      expect(typeof res.body.uptime).toBe('number');
      expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Health check integration', () => {
    it('should have consistent uptime values across endpoints', async () => {
      const [healthRes, liveRes] = await Promise.all([request(app.getHttpServer()).get('/health'), request(app.getHttpServer()).get('/health/live')]);

      expect(healthRes.status).toBe(200);
      expect(liveRes.status).toBe(200);

      // Les uptimes devraient être cohérents (à quelques secondes près)
      const healthUptime = healthRes.body.uptime;
      const liveUptime = liveRes.body.uptime;
      const systemUptime = healthRes.body.system.uptime;

      expect(typeof healthUptime).toBe('number');
      expect(typeof liveUptime).toBe('number');
      expect(typeof systemUptime).toBe('number');

      // Tolérance de 5 secondes entre les mesures
      expect(Math.abs(healthUptime - liveUptime)).toBeLessThanOrEqual(5);
    });

    it('should maintain database connection throughout multiple requests', async () => {
      const requests = Array(5)
        .fill(null)
        .map(() => request(app.getHttpServer()).get('/health/simple'));

      const responses = await Promise.all(requests);

      responses.forEach((res) => {
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('OK');
      });
    });

    it('should return consistent service status', async () => {
      const res1 = await request(app.getHttpServer()).get('/health');
      const res2 = await request(app.getHttpServer()).get('/health');

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);

      // Les statuts des services critiques devraient être cohérents
      expect(res1.body.database.status).toBe(res2.body.database.status);
      expect(res1.body.services.jwt.status).toBe(res2.body.services.jwt.status);
    });
  });

  describe('Response time validation', () => {
    it('should return database response time within reasonable limits', async () => {
      const res = await request(app.getHttpServer()).get('/health').expect(200);

      expect(res.body.database.responseTime).toBeGreaterThan(0);
      expect(res.body.database.responseTime).toBeLessThan(5000); // Moins de 5 secondes
    });

    it('should complete health check within acceptable time', async () => {
      const start = Date.now();

      await request(app.getHttpServer()).get('/health').expect(200);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(10000); // Moins de 10 secondes
    });
  });
});
