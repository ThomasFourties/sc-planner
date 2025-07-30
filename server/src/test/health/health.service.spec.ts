import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { HealthService } from '../../health/health.service';
import { User } from '../../users/entities/user.entity';
import { EmailService } from '../../email/email.service';

describe('HealthService', () => {
  let service: HealthService;

  const mockRepository = {
    query: jest.fn(),
    count: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockEmailService = {};

  const originalEnv = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...originalEnv };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getHealthCheck', () => {
    it('should return healthy status when all services are working', async () => {
      process.env.EMAIL_HOST = 'smtp.test.com';
      process.env.EMAIL_PORT = '587';
      process.env.EMAIL_USER = 'test@test.com';
      process.env.EMAIL_PASS = 'test-password';
      process.env.JWT_SECRET = 'test-secret';

      mockRepository.query.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(5);
      mockJwtService.sign.mockReturnValue('test-token');
      mockJwtService.verify.mockReturnValue({ test: true });

      const result = await service.getHealthCheck();

      expect(result.status).toBe('healthy');
      expect(result.database.status).toBe('healthy');
      expect(result.services.jwt.status).toBe('healthy');
      expect(result.services.email.status).toBe('healthy');
      expect(typeof result.uptime).toBe('number');
    });

    it('should return degraded status when email service is not configured', async () => {
      process.env.JWT_SECRET = 'test-secret';
      delete process.env.EMAIL_HOST;
      delete process.env.EMAIL_PORT;
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASS;

      mockRepository.query.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(5);
      mockJwtService.sign.mockReturnValue('test-token');
      mockJwtService.verify.mockReturnValue({ test: true });

      const result = await service.getHealthCheck();

      expect(result.status).toBe('degraded');
      expect(result.database.status).toBe('healthy');
      expect(result.services.jwt.status).toBe('healthy');
      expect(result.services.email.status).toBe('unhealthy');
      expect(result.services.email.configured).toBe(false);
    });

    it('should return unhealthy status when database is down', async () => {
      mockRepository.query.mockRejectedValue(new Error('Connection failed'));

      const result = await service.getHealthCheck();

      expect(result.status).toBe('unhealthy');
      expect(result.database.status).toBe('unhealthy');
    });

    it('should return degraded status when JWT is not configured', async () => {
      delete process.env.JWT_SECRET;

      process.env.EMAIL_HOST = 'smtp.test.com';
      process.env.EMAIL_PORT = '587';
      process.env.EMAIL_USER = 'test@test.com';
      process.env.EMAIL_PASS = 'test-password';

      mockRepository.query.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(5);

      const result = await service.getHealthCheck();

      expect(result.status).toBe('degraded');
      expect(result.services.jwt.status).toBe('unhealthy');
      expect(result.services.jwt.configured).toBe(false);
    });
  });

  describe('getSimpleHealth', () => {
    it('should return OK when database is accessible', async () => {
      mockRepository.query.mockResolvedValue([]);

      const result = await service.getSimpleHealth();

      expect(result.status).toBe('OK');
      expect(result.timestamp).toBeDefined();
    });

    it('should throw error when database is not accessible', async () => {
      mockRepository.query.mockRejectedValue(new Error('DB Error'));

      await expect(service.getSimpleHealth()).rejects.toThrow(
        'Health check failed',
      );
    });
  });
});
