// import { Controller, Get } from '@nestjs/common';
// import { HealthService, MetricsResponse } from './health.service';

// @Controller()
// export class HealthController {
//   constructor(private readonly healthService: HealthService) {}

//   @Get('health')
//   async check() {
//     return this.healthService.basicHealthCheck();
//   }

//   @Get('metrics')
//   async getMetrics(): Promise<MetricsResponse> {
//     return this.healthService.getMetrics();
//   }
// }
