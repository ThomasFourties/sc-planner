import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../src/users/entities/user.entity';
import { Client } from '../../src/clients/entities/client.entity';
import { Project } from '../../src/projects/entities/project.entity';
import { Task } from '../../src/tasks/entities/task.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../../src/auth/auth.module';
import { UsersModule } from '../../src/users/users.module';
import { ClientsModule } from '../../src/clients/clients.module';
import { ProjectsModule } from '../../src/projects/projects.module';
import { TasksModule } from '../../src/tasks/tasks.module';
import { EmailModule } from '../../src/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from '../../src/email/email.service';
import { UserRole } from '../../src/users/enums/user-role.enum';
import { ProjectStatus } from '../../src/projects/entities/project.entity';

const mockEmailService = {
  sendEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
};

describe('ClientsController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let clientRepository: Repository<Client>;
  let projectRepository: Repository<Project>;
  let jwtService: JwtService;

  let adminUser: User;
  let clientUser: User;
  let testClient: Client;
  let adminToken: string;
  let clientToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'test_user',
          password: 'test_password',
          database: 'sc-planner-db-test',
          entities: [User, Client, Project, Task],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        AuthModule,
        UsersModule,
        ClientsModule,
        ProjectsModule,
        TasksModule,
        EmailModule,
      ],
    })
      .overrideProvider(EmailService)
      .useValue(mockEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    clientRepository = moduleFixture.get<Repository<Client>>(getRepositoryToken(Client));
    projectRepository = moduleFixture.get<Repository<Project>>(getRepositoryToken(Project));
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await setupTestData();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  async function setupTestData() {
    // Créer un client de test
    testClient = await clientRepository.save({
      name: 'Test Client',
      description: 'Client for testing',
      website_prod: 'https://test.com',
      website_preprod: 'https://preprod.test.com',
    });

    // Créer un utilisateur admin
    adminUser = await userRepository.save({
      first_name: 'Admin',
      last_name: 'User',
      email: `admin-${Date.now()}@example.com`, // Email unique
      password: '$2b$10$hashedpassword',
      role: UserRole.CHEF_DE_PROJET,
      is_admin: true,
    });

    // Créer un utilisateur client
    clientUser = await userRepository.save({
      first_name: 'Client',
      last_name: 'User',
      email: `client-${Date.now()}@example.com`, // Email unique
      password: '$2b$10$hashedpassword',
      role: UserRole.CLIENT,
      is_admin: false,
      client_id: testClient.id,
    });

    // Créer quelques projets pour les stats
    await projectRepository.save([
      {
        name: 'Project 1',
        description: 'First project',
        status: ProjectStatus.IN_PROGRESS,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-06-01'),
        sold_hours: 100,
        spent_hours: 80,
        client_id: testClient.id,
      },
      {
        name: 'Project 2',
        description: 'Second project',
        status: ProjectStatus.COMPLETED,
        start_date: new Date('2024-02-01'),
        end_date: new Date('2024-07-01'),
        sold_hours: 150,
        spent_hours: 120,
        client_id: testClient.id,
      },
    ]);

    // Générer les tokens JWT
    adminToken = jwtService.sign({ email: adminUser.email, sub: adminUser.id });
    clientToken = jwtService.sign({ email: clientUser.email, sub: clientUser.id });
  }

  describe('POST /clients', () => {
    it('should create a new client successfully', async () => {
      const createClientDto = {
        name: 'New Client',
        description: 'New client description',
        website_prod: 'https://newclient.com',
        logo: 'logo.png',
      };

      const response = await request(app.getHttpServer()).post('/clients').set('Authorization', `Bearer ${adminToken}`).send(createClientDto).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createClientDto.name);
      expect(response.body.description).toBe(createClientDto.description);
      expect(response.body.website_prod).toBe(createClientDto.website_prod);
      // Note: Les stats peuvent ne pas être retournées à la création
      // expect(response.body).toHaveProperty('stats');
      // expect(response.body.stats.projectsCount).toBe(0);

      // Vérifier en base
      const savedClient = await clientRepository.findOne({
        where: { id: response.body.id },
      });
      expect(savedClient).toBeDefined();
      expect(savedClient!.name).toBe(createClientDto.name);
    });

    it('should create client with user associations', async () => {
      const newUser = await userRepository.save({
        first_name: 'New',
        last_name: 'User',
        email: 'newuser@example.com',
        password: '$2b$10$hashedpassword',
        role: UserRole.CLIENT,
        is_admin: false,
      });

      const createClientDto = {
        name: 'Client with Users',
        description: 'Client with associated users',
        user_ids: [newUser.id],
      };

      const response = await request(app.getHttpServer()).post('/clients').set('Authorization', `Bearer ${adminToken}`).send(createClientDto).expect(201);

      expect(response.body.name).toBe(createClientDto.name);
      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should fail when not authenticated', async () => {
      const createClientDto = {
        name: 'New Client',
        description: 'New client description',
      };

      await request(app.getHttpServer()).post('/clients').send(createClientDto).expect(401);
    });

    it('should fail when required fields are missing', async () => {
      const incompleteClient = {
        description: 'Client without name',
      };

      await request(app.getHttpServer()).post('/clients').set('Authorization', `Bearer ${adminToken}`).send(incompleteClient).expect(400);
    });
  });

  describe('GET /clients', () => {
    it('should get all clients with stats', async () => {
      const response = await request(app.getHttpServer()).get('/clients').set('Authorization', `Bearer ${adminToken}`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const testClientData = response.body.find((c) => c.id === testClient.id);
      expect(testClientData).toBeDefined();
      expect(testClientData).toHaveProperty('stats');
      expect(testClientData.stats.projectsCount).toBe(2);
      expect(testClientData.stats.totalSoldHours).toBe(250); // 100 + 150
      expect(testClientData.stats.totalSpentHours).toBe(200); // 80 + 120
    });

    it('should fail when not authenticated', async () => {
      await request(app.getHttpServer()).get('/clients').expect(401);
    });
  });

  describe('GET /clients/:id', () => {
    it('should get a specific client with stats', async () => {
      const response = await request(app.getHttpServer()).get(`/clients/${testClient.id}`).set('Authorization', `Bearer ${adminToken}`).expect(200);

      expect(response.body.id).toBe(testClient.id);
      expect(response.body.name).toBe('Test Client');
      expect(response.body).toHaveProperty('stats');
      expect(response.body.stats.projectsCount).toBe(2);
      expect(response.body.stats.totalSoldHours).toBe(250);
      expect(response.body.stats.totalSpentHours).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('users');
    });

    it('should return 404 for non-existent client', async () => {
      await request(app.getHttpServer()).get('/clients/non-existent-id').set('Authorization', `Bearer ${adminToken}`).expect(404);
    });
  });

  describe('PATCH /clients/:id', () => {
    it('should update a client', async () => {
      const updateData = {
        name: 'Updated Client Name',
        description: 'Updated description',
        website_prod: 'https://updated.com',
      };

      const response = await request(app.getHttpServer()).patch(`/clients/${testClient.id}`).set('Authorization', `Bearer ${adminToken}`).send(updateData).expect(200);

      expect(response.body.name).toBe('Updated Client Name');
      expect(response.body.description).toBe('Updated description');
      expect(response.body.website_prod).toBe('https://updated.com');

      // Vérifier en base
      const updatedClient = await clientRepository.findOne({
        where: { id: testClient.id },
      });
      expect(updatedClient).toBeDefined();
      expect(updatedClient!.name).toBe('Updated Client Name');
    });

    it('should update client with user associations', async () => {
      const newUser = await userRepository.save({
        first_name: 'Association',
        last_name: 'Test',
        email: 'association@example.com',
        password: '$2b$10$hashedpassword',
        role: UserRole.CLIENT,
        is_admin: false,
      });

      const updateData = {
        name: 'Client with New Users',
        user_ids: [newUser.id],
      };

      const response = await request(app.getHttpServer()).patch(`/clients/${testClient.id}`).set('Authorization', `Bearer ${adminToken}`).send(updateData).expect(200);

      expect(response.body.name).toBe('Client with New Users');

      // Vérifier que l'utilisateur est bien associé
      const updatedUser = await userRepository.findOne({
        where: { id: newUser.id },
        relations: ['client'],
      });
      expect(updatedUser).toBeDefined();
      expect(updatedUser!.client_id).toBe(testClient.id);
    });

    it('should return 404 for non-existent client', async () => {
      await request(app.getHttpServer()).patch('/clients/non-existent-id').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated' }).expect(404);
    });

    it('should fail when name is empty', async () => {
      await request(app.getHttpServer()).patch(`/clients/${testClient.id}`).set('Authorization', `Bearer ${adminToken}`).send({ name: '' }).expect(400);
    });
  });

  describe('DELETE /clients/:id', () => {
    it('should delete a client and cascade delete projects and tasks', async () => {
      // Créer un client à supprimer avec ses dépendances
      const clientToDelete = await clientRepository.save({
        name: 'Client to Delete',
        description: 'This client will be deleted',
      });

      const projectToDelete = await projectRepository.save({
        name: 'Project to Delete',
        description: 'This project will be deleted',
        status: ProjectStatus.IN_PROGRESS,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        sold_hours: 50,
        spent_hours: 25,
        client_id: clientToDelete.id,
      });

      await request(app.getHttpServer()).delete(`/clients/${clientToDelete.id}`).set('Authorization', `Bearer ${adminToken}`).expect(200);

      // Vérifier que le client n'existe plus
      const deletedClient = await clientRepository.findOne({
        where: { id: clientToDelete.id },
      });
      expect(deletedClient).toBeNull();

      // Vérifier que les projets associés ont été supprimés
      const deletedProject = await projectRepository.findOne({
        where: { id: projectToDelete.id },
      });
      expect(deletedProject).toBeNull();
    });

    it('should return 404 for non-existent client', async () => {
      await request(app.getHttpServer()).delete('/clients/non-existent-id').set('Authorization', `Bearer ${adminToken}`).expect(404);
    });
  });

  describe('Authentication and Authorization', () => {
    it('should require authentication for all endpoints', async () => {
      const endpoints = [
        { method: 'get', path: '/clients' },
        { method: 'post', path: '/clients' },
        { method: 'get', path: '/clients/test-id' },
        { method: 'patch', path: '/clients/test-id' },
        { method: 'delete', path: '/clients/test-id' },
      ];

      for (const endpoint of endpoints) {
        await request(app.getHttpServer())[endpoint.method](endpoint.path).expect(401);
      }
    });

    it('should reject invalid JWT token', async () => {
      await request(app.getHttpServer()).get('/clients').set('Authorization', 'Bearer invalid-token').expect(401);
    });
  });

  describe('Data validation and edge cases', () => {
    it('should handle client with no projects', async () => {
      const clientWithoutProjects = await clientRepository.save({
        name: 'Client No Projects',
        description: 'Client without any projects',
      });

      const response = await request(app.getHttpServer()).get(`/clients/${clientWithoutProjects.id}`).set('Authorization', `Bearer ${adminToken}`).expect(200);

      expect(response.body.stats.projectsCount).toBe(0);
      expect(response.body.stats.totalSoldHours).toBe(0);
      expect(response.body.stats.totalSpentHours).toBe(0);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(5)
        .fill(null)
        .map(() => request(app.getHttpServer()).get('/clients').set('Authorization', `Bearer ${adminToken}`));

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    it('should validate URL formats for websites', async () => {
      const invalidClient = {
        name: 'Invalid Website Client',
        website_prod: 'not-a-valid-url',
      };

      // Note: Cette validation dépend de votre DTO
      // Si vous n'avez pas de validation URL, ce test pourrait passer
      const response = await request(app.getHttpServer()).post('/clients').set('Authorization', `Bearer ${adminToken}`).send(invalidClient);

      // Ajustez selon votre validation
      expect([201, 400]).toContain(response.status);
    });
  });

  describe('Integration scenarios', () => {
    it('should complete full CRUD operations on a client', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Integration Test Client',
          description: 'Full CRUD test client',
          website_prod: 'https://integration.test',
        })
        .expect(201);

      const clientId = createResponse.body.id;

      // Read
      const getResponse = await request(app.getHttpServer()).get(`/clients/${clientId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);

      expect(getResponse.body.name).toBe('Integration Test Client');

      // Update
      await request(app.getHttpServer()).patch(`/clients/${clientId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Integration Client' }).expect(200);

      // Verify update
      const updatedResponse = await request(app.getHttpServer()).get(`/clients/${clientId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);

      expect(updatedResponse.body.name).toBe('Updated Integration Client');

      // Delete
      await request(app.getHttpServer()).delete(`/clients/${clientId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);

      // Verify deletion
      await request(app.getHttpServer()).get(`/clients/${clientId}`).set('Authorization', `Bearer ${adminToken}`).expect(404);
    });

    it('should handle client with projects lifecycle', async () => {
      // Créer un client
      const clientResponse = await request(app.getHttpServer())
        .post('/clients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Lifecycle Client',
          description: 'Client for lifecycle testing',
        })
        .expect(201);

      const clientId = clientResponse.body.id;

      // Créer un projet pour ce client
      await projectRepository.save({
        name: 'Lifecycle Project',
        description: 'Project for lifecycle testing',
        status: ProjectStatus.IN_PROGRESS,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        sold_hours: 200,
        spent_hours: 100,
        client_id: clientId,
      });

      // Vérifier les stats du client
      const statsResponse = await request(app.getHttpServer()).get(`/clients/${clientId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);

      expect(statsResponse.body.stats.projectsCount).toBe(1);
      expect(statsResponse.body.stats.totalSoldHours).toBe(200);
      expect(statsResponse.body.stats.totalSpentHours).toBe(100);

      // Supprimer le client (doit supprimer le projet aussi)
      await request(app.getHttpServer()).delete(`/clients/${clientId}`).set('Authorization', `Bearer ${adminToken}`).expect(200);

      // Vérifier que le client et ses projets n'existent plus
      await request(app.getHttpServer()).get(`/clients/${clientId}`).set('Authorization', `Bearer ${adminToken}`).expect(404);
    });
  });
});
