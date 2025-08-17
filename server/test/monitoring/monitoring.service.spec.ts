import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringService } from './../../src/monitoring/monitoring.service';
import { register } from 'prom-client';

describe('MonitoringService', () => {
  let service: MonitoringService;

  beforeEach(async () => {
    // Nettoyer le registre avant chaque test
    register.clear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringService],
    }).compile();

    service = module.get<MonitoringService>(MonitoringService);

    // Attendre un peu pour que les métriques par défaut se chargent
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterEach(() => {
    // Nettoyer après chaque test
    register.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('HTTP Metrics', () => {
    it('should increment http requests counter', async () => {
      service.incrementHttpRequests('GET', '/test', 200);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('http_requests_total{method="GET",route="/test",status="200"} 1');
    });

    it('should observe http request duration', async () => {
      service.observeHttpDuration('POST', '/api/test', 0.5);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('http_request_duration_seconds_sum{method="POST",route="/api/test"}');
      expect(metrics).toContain('http_request_duration_seconds_count{method="POST",route="/api/test"} 1');
    });
  });

  describe('Health Metrics', () => {
    it('should set memory usage', async () => {
      service.setMemoryUsage(45.5);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('system_memory_usage_percent 45.5');
    });

    it('should set CPU usage', async () => {
      service.setCpuUsage(75.3);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('system_cpu_usage_percent 75.3');
    });

    it('should observe database response time', async () => {
      service.observeDbResponseTime(150);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('database_response_time_ms_sum');
      expect(metrics).toContain('database_response_time_ms_count 1');
    });

    it('should set service status', async () => {
      service.setServiceStatus('database', 1);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('service_status{service_name="database"} 1');
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance when instantiated multiple times', () => {
      expect(service).toBeDefined();
      expect(service.getMetrics).toBeDefined();
    });

    it('should maintain metric state across method calls', async () => {
      service.incrementHttpRequests('GET', '/test', 200);
      service.incrementHttpRequests('GET', '/test', 200);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('http_requests_total{method="GET",route="/test",status="200"} 2');
    });
  });

  describe('Metric Registry', () => {
    it('should collect default metrics', async () => {
      const metrics = await service.getMetrics();

      expect(metrics).toContain('process_cpu_user_seconds_total');
      expect(metrics).toContain('nodejs_heap_size_total_bytes');
    });

    it('should return valid prometheus format', async () => {
      service.setMemoryUsage(50);

      const metrics = await service.getMetrics();
      expect(metrics).not.toBe('');
      expect(metrics).toContain('# HELP');
      expect(metrics).toContain('# TYPE');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple increments of the same metric', async () => {
      service.incrementHttpRequests('GET', '/test', 200);
      service.incrementHttpRequests('GET', '/test', 200);
      service.incrementHttpRequests('GET', '/test', 200);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('http_requests_total{method="GET",route="/test",status="200"} 3');
    });

    it('should handle zero values', async () => {
      service.setMemoryUsage(0);
      service.setCpuUsage(0);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('system_memory_usage_percent 0');
      expect(metrics).toContain('system_cpu_usage_percent 0');
    });

    it('should handle negative response times gracefully', async () => {
      service.observeDbResponseTime(-1);
      const metrics = await service.getMetrics();
      expect(metrics).toContain('database_response_time_ms_count 1');
    });

    it('should handle different HTTP status codes', async () => {
      service.incrementHttpRequests('POST', '/api/users', 201);
      service.incrementHttpRequests('GET', '/api/users', 404);
      service.incrementHttpRequests('DELETE', '/api/users', 500);

      const metrics = await service.getMetrics();
      expect(metrics).toContain('http_requests_total{method="POST",route="/api/users",status="201"} 1');
      expect(metrics).toContain('http_requests_total{method="GET",route="/api/users",status="404"} 1');
      expect(metrics).toContain('http_requests_total{method="DELETE",route="/api/users",status="500"} 1');
    });
  });

  describe('Service Integration', () => {
    it('should work with multiple metrics simultaneously', async () => {
      service.incrementHttpRequests('GET', '/health', 200);
      service.observeHttpDuration('GET', '/health', 0.1);
      service.setMemoryUsage(65.2);
      service.setCpuUsage(23.8);
      service.observeDbResponseTime(45);
      service.setServiceStatus('database', 1);

      const metrics = await service.getMetrics();

      expect(metrics).toContain('http_requests_total{method="GET",route="/health",status="200"} 1');
      expect(metrics).toContain('http_request_duration_seconds_count{method="GET",route="/health"} 1');
      expect(metrics).toContain('system_memory_usage_percent 65.2');
      expect(metrics).toContain('system_cpu_usage_percent 23.8');
      expect(metrics).toContain('database_response_time_ms_count 1');
      expect(metrics).toContain('service_status{service_name="database"} 1');
    });
  });
});
