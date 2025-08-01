import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { HealthController } from './health.controller';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { User } from '../users/entities/user.entity';
import { EmailModule } from '../email/email.module';
import { HealthService } from './health.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, EmailModule, MonitoringModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
