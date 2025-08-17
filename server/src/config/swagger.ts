import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('SC Planner API')
    .setDescription("Documentation complète de l'API SC Planner. Cette API permet de gérer la planification et le suivi des projets, des tâches et des clients.")
    .setVersion('1.0.0')
    .addServer('http://localhost:3002', 'Local development')
    .addServer('https://staging.sc-planner.thomasfourties.fr', 'Staging environment')
    .addServer('https://sc-planner.thomasfourties.fr', 'Production environment')
    .addTag('Auth', "Endpoints liés à l'authentification")
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Projects', 'Gestion des projets')
    .addTag('Tasks', 'Gestion des tâches')
    .addTag('Clients', 'Gestion des clients')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Configuration des options Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        theme: 'monokai',
      },
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SC Planner API Documentation',
  });
}
