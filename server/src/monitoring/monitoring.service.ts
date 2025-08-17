import { Injectable } from '@nestjs/common';
import { register, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MonitoringService {
  private httpRequestsCounter: Counter<string>;
  private httpDurationHistogram: Histogram<string>;
  private memoryUsageGauge: Gauge<string>;
  private cpuUsageGauge: Gauge<string>;
  private dbResponseTimeHistogram: Histogram<string>;
  private serviceStatusGauge: Gauge<string>;

  constructor() {
    // Activer la collecte des métriques par défaut
    collectDefaultMetrics({ register });

    // Compteur des requêtes HTTP
    this.httpRequestsCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [register],
    });

    // Histogramme de durée des requêtes HTTP
    this.httpDurationHistogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route'],
      registers: [register],
    });

    // Gauge pour l'utilisation mémoire
    this.memoryUsageGauge = new Gauge({
      name: 'system_memory_usage_percent',
      help: 'System memory usage percentage',
      registers: [register],
    });

    // Gauge pour l'utilisation CPU
    this.cpuUsageGauge = new Gauge({
      name: 'system_cpu_usage_percent',
      help: 'System CPU usage percentage',
      registers: [register],
    });

    // Histogramme pour le temps de réponse de la base de données
    this.dbResponseTimeHistogram = new Histogram({
      name: 'database_response_time_ms',
      help: 'Database response time in milliseconds',
      registers: [register],
    });

    // Gauge pour le statut des services
    this.serviceStatusGauge = new Gauge({
      name: 'service_status',
      help: 'Service status (1 = up, 0 = down)',
      labelNames: ['service_name'],
      registers: [register],
    });
  }

  incrementHttpRequests(method: string, route: string, status: number): void {
    this.httpRequestsCounter.inc({ method, route, status: status.toString() });
  }

  observeHttpDuration(method: string, route: string, duration: number): void {
    this.httpDurationHistogram.observe({ method, route }, duration);
  }

  setMemoryUsage(percentage: number): void {
    this.memoryUsageGauge.set(percentage);
  }

  setCpuUsage(percentage: number): void {
    this.cpuUsageGauge.set(percentage);
  }

  observeDbResponseTime(timeMs: number): void {
    // Gérer les valeurs négatives en les convertissant en 0
    const validTime = Math.max(0, timeMs);
    this.dbResponseTimeHistogram.observe(validTime);
  }

  setServiceStatus(serviceName: string, status: number): void {
    this.serviceStatusGauge.set({ service_name: serviceName }, status);
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
