import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ProjectController,
  HelloController,
} from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ProjectEntity } from './entities/project.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT') || '5432', 10),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [ProjectEntity],
        migrations: ['src/migrations/*.js'],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([ProjectEntity]),
  ],
  controllers: [ProjectController, HelloController],
  providers: [AppService],
})

export class AppModule {}
