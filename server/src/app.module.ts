import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ProjectController,
  HelloController,
} from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ProjectEntity } from './entities/project.entity';
import { createConnection, getConnection } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('DATABASE_HOST');
        const port = parseInt(configService.get('DATABASE_PORT') || '5432', 10);
        const username = configService.get('DATABASE_USER');
        const password = configService.get('DATABASE_PASSWORD');
        const database = configService.get('DATABASE_NAME');

        // Affichage des valeurs de la configuration
        console.log('Connecting to database...');
        console.log('DATABASE_HOST:', host);
        console.log('DATABASE_PORT:', port);
        console.log('DATABASE_USER:', username);
        console.log('DATABASE_PASSWORD:', password);
        console.log('DATABASE_NAME:', database);

        // Test de connexion
        try {
          console.log('Testing database connection...');
          const connection = await createConnection({
            type: 'postgres',
            host: host,
            port: port,
            username: username,
            password: password,
            database: database,
            entities: [ProjectEntity],
            synchronize: true,
            logging: false,
          });

          // Si la connexion réussit
          console.log('Connection test successful!');
          await connection.close(); // Ferme la connexion après le test
        } catch (error) {
          console.error('Connection test failed:', error);
          throw new Error('Database connection test failed');
        }

        // Configuration de TypeORM pour l'application NestJS
        return {
          type: 'postgres',
          host: host,
          port: port,
          username: username,
          password: password,
          database: database,
          entities: [ProjectEntity],
          migrations: ['src/migrations/*.js'],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([ProjectEntity]),
  ],
  controllers: [ProjectController, HelloController],
  providers: [AppService],
})
export class AppModule {}
