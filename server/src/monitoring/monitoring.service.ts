// server/src/monitoring/monitoring.service.ts - VERSION SINGLETON (RECOMMANDÉE)

import { Injectable } from '@nestjs/common';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MonitoringService {
  private static instance: MonitoringService;
  private static metricsInitialized = false;

  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly memoryUsagePercent: Gauge<string>;
  private readonly cpuUsagePercent: Gauge<string>;
  private readonly dbResponseTime: Histogram<string>;
  private readonly serviceStatus: Gauge<string>;

  constructor() {
    // 🔥 Pattern Singleton pour éviter la double initialisation
    if (MonitoringService.instance) {
      return MonitoringService.instance;
    }

    if (!MonitoringService.metricsInitialized) {
      // Clear le registry seulement la première fois
      register.clear();

      // Collecte des métriques par défaut de Node.js
      collectDefaultMetrics({ register });

      MonitoringService.metricsInitialized = true;
    }

    // Métriques HTTP
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [register],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [register],
    });

    // Métriques health
    this.memoryUsagePercent = new Gauge({
      name: 'system_memory_usage_percent',
      help: 'System memory usage percentage from health check',
      registers: [register],
    });

    this.cpuUsagePercent = new Gauge({
      name: 'system_cpu_usage_percent',
      help: 'System CPU usage percentage from health check',
      registers: [register],
    });

    this.dbResponseTime = new Histogram({
      name: 'database_response_time_ms',
      help: 'Database response time in milliseconds from health check',
      buckets: [5, 10, 25, 50, 100, 250, 500],
      registers: [register],
    });

    this.serviceStatus = new Gauge({
      name: 'service_status',
      help: 'Status of various services (1=healthy, 0=unhealthy)',
      labelNames: ['service_name'],
      registers: [register],
    });

    MonitoringService.instance = this;
  }

  // Méthodes HTTP
  incrementHttpRequests(method: string, route: string, status: number) {
    this.httpRequestsTotal.inc({ method, route, status: status.toString() });
  }

  observeHttpDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  // Méthodes Health
  setMemoryUsage(percentage: number) {
    this.memoryUsagePercent.set(percentage);
  }

  setCpuUsage(percentage: number) {
    this.cpuUsagePercent.set(percentage);
  }

  observeDbResponseTime(timeMs: number) {
    this.dbResponseTime.observe(timeMs);
  }

  setServiceStatus(serviceName: string, status: number) {
    this.serviceStatus.set({ service_name: serviceName }, status);
  }

  // Exposer les métriques
  getMetrics(): Promise<string> {
    return register.metrics();
  }
}
