import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { EmailService } from '../auth/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])],
  controllers: [HealthController],
  providers: [HealthService, EmailService],
  exports: [HealthService],
})
export class HealthModule {}
