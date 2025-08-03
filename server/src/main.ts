import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { MetricsInterceptor } from './monitoring/metrics.interceptor';
import { MonitoringService } from './monitoring/monitoring.service';

// comments

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3000', 'https://sc-planner.thomasfourties.fr', 'https://staging.sc-planner.thomasfourties.fr'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  });

  app.useGlobalPipes(new ValidationPipe());

  const monitoringService = app.get(MonitoringService);
  app.useGlobalInterceptors(new MetricsInterceptor(monitoringService));

  await app.listen(3002);
  console.log('🚀 Server running on http://localhost:3002');
  console.log('📊 Metrics available on http://localhost:3002/api/metrics');
}

bootstrap();
