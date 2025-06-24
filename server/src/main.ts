import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // get the tag from the image

  app.enableCors({
    origin: ['http://localhost:3000', 'https://sc-planner.thomasfourties.fr'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('SC Planner API')
    .setDescription(
      "Documentation de l'API SC Planner pour la gestion des utilisateurs et de l'authentification",
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Entrez le token JWT',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'SC Planner API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(3001);
  console.log(`🚀 Serveur démarré sur ${process.env.API_URL}`);
  console.log(
    `📖 Documentation API disponible sur ${process.env.API_URL}/docs`,
  );
}

bootstrap();
