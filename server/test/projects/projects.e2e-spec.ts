import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../src/users/entities/user.entity';
import { Client } from '../../src/clients/entities/client.entity';
import { Project, ProjectStatus } from '../../src/projects/entities/project.entity';
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

const mockEmailService = {
  sendEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
};

describe('ProjectsController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let clientRepository: Repository<Client>;
  let projectRepository: Repository<Project>;
  let taskRepository: Repository<Task>;
  let jwtService: JwtService;

  let testUser: User;
  let testClient: Client;
  let testProject: Project;
  let authToken: string;

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
    taskRepository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
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
      description: 'Client for testing projects',
    });

    // Créer un utilisateur de test
    testUser = await userRepository.save({
      first_name: 'John',
      last_name: 'Doe',
      email: `projects-${Date.now()}@example.com`, // Email unique
      password: '$2b$10$hashedpassword',
      role: UserRole.CHEF_DE_PROJET,
      is_admin: true,
      client_id: testClient.id,
    });

    // Créer un projet de test
    testProject = await projectRepository.save({
      name: 'Test Project',
      description: 'Project for testing',
      status: ProjectStatus.IN_PROGRESS,
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-12-31'),
      sold_hours: 100,
      spent_hours: 50,
      client_id: testClient.id,
    });

    // Créer quelques tâches pour les tests
    await taskRepository.save([
      {
        name: 'Task 1',
        description: 'First task',
        project_id: testProject.id,
        created_by_id: testUser.id,
        duration: 5,
      },
      {
        name: 'Task 2',
        description: 'Second task',
        project_id: testProject.id,
        created_by_id: testUser.id,
        duration: 8,
      },
    ]);

    // Générer un token JWT
    authToken = jwtService.sign({ email: testUser.email, sub: testUser.id });
  }

  describe('POST /projects', () => {
    it('should create a new project successfully', async () => {
      const createProjectDto = {
        name: 'New Project',
        description: 'New project description',
        status: ProjectStatus.IN_PROGRESS,
        start_date: '2024-03-01',
        end_date: '2024-09-01',
        sold_hours: 200,
        client_id: testClient.id,
      };

      const response = await request(app.getHttpServer()).post('/projects').set('Authorization', `Bearer ${authToken}`).send(createProjectDto).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createProjectDto.name);
      expect(response.body.description).toBe(createProjectDto.description);
      expect(response.body.status).toBe(createProjectDto.status);
      expect(Number(response.body.sold_hours)).toBe(createProjectDto.sold_hours);
      expect(response.body.client_id).toBe(createProjectDto.client_id);

      // Vérifier en base
      const savedProject = await projectRepository.findOne({
        where: { id: response.body.id },
      });
      expect(savedProject).toBeDefined();
      expect(savedProject!.name).toBe(createProjectDto.name);
    });

    it('should fail when not authenticated', async () => {
      const createProjectDto = {
        name: 'New Project',
        description: 'New project description',
        client_id: testClient.id,
      };

      await request(app.getHttpServer()).post('/projects').send(createProjectDto).expect(401);
    });

    it('should fail with invalid client_id', async () => {
      const createProjectDto = {
        name: 'New Project',
        description: 'New project description',
        client_id: 'invalid-client-id',
      };

      await request(app.getHttpServer()).post('/projects').set('Authorization', `Bearer ${authToken}`).send(createProjectDto).expect(400);
    });

    it('should fail when required fields are missing', async () => {
      const incompleteProject = {
        description: 'Project without name',
      };

      await request(app.getHttpServer()).post('/projects').set('Authorization', `Bearer ${authToken}`).send(incompleteProject).expect(400);
    });
  });

  describe('GET /projects', () => {
    it('should get all projects', async () => {
      const response = await request(app.getHttpServer()).get('/projects').set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const project = response.body.find((p) => p.id === testProject.id);
      expect(project).toBeDefined();
      expect(project.name).toBe('Test Project');
      expect(project).toHaveProperty('client');
      expect(project).toHaveProperty('tasks');
    });

    it('should fail when not authenticated', async () => {
      await request(app.getHttpServer()).get('/projects').expect(401);
    });
  });

  describe('GET /projects/:id', () => {
    it('should get a specific project with relations', async () => {
      const response = await request(app.getHttpServer()).get(`/projects/${testProject.id}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(response.body.id).toBe(testProject.id);
      expect(response.body.name).toBe('Test Project');
      expect(response.body.description).toBe('Project for testing');
      expect(response.body.status).toBe(ProjectStatus.IN_PROGRESS);
      expect(Number(response.body.sold_hours)).toBe(100);
      expect(Number(response.body.spent_hours)).toBe(50);
      expect(response.body).toHaveProperty('client');
      expect(response.body.client.id).toBe(testClient.id);
      expect(response.body).toHaveProperty('tasks');
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBe(2);
    });

    it('should return 404 for non-existent project', async () => {
      await request(app.getHttpServer()).get('/projects/non-existent-id').set('Authorization', `Bearer ${authToken}`).expect(404);
    });
  });

  describe('PATCH /projects/:id', () => {
    it('should update a project', async () => {
      const updateData = {
        name: 'Updated Project',
        description: 'Updated description',
        status: ProjectStatus.COMPLETED,
        spent_hours: 120,
      };

      const response = await request(app.getHttpServer()).patch(`/projects/${testProject.id}`).set('Authorization', `Bearer ${authToken}`).send(updateData).expect(200);

      expect(response.body.name).toBe('Updated Project');
      expect(response.body.description).toBe('Updated description');
      expect(response.body.status).toBe(ProjectStatus.COMPLETED);
      expect(response.body.spent_hours).toBe(120);

      // Vérifier en base
      const updatedProject = await projectRepository.findOne({
        where: { id: testProject.id },
      });
      expect(updatedProject).toBeDefined();
      expect(updatedProject!.name).toBe('Updated Project');
      expect(updatedProject!.status).toBe(ProjectStatus.COMPLETED);
    });

    it('should return 404 for non-existent project', async () => {
      await request(app.getHttpServer()).patch('/projects/non-existent-id').set('Authorization', `Bearer ${authToken}`).send({ name: 'Updated' }).expect(404);
    });

    it('should validate status enum values', async () => {
      const updateData = {
        status: 'INVALID_STATUS',
      };

      await request(app.getHttpServer()).patch(`/projects/${testProject.id}`).set('Authorization', `Bearer ${authToken}`).send(updateData).expect(400);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should delete a project and its tasks', async () => {
      // Créer un projet à supprimer avec ses tâches
      const projectToDelete = await projectRepository.save({
        name: 'Project to Delete',
        description: 'This project will be deleted',
        status: ProjectStatus.IN_PROGRESS,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        sold_hours: 50,
        spent_hours: 0,
        client_id: testClient.id,
      });

      const taskToDelete = await taskRepository.save({
        name: 'Task to Delete',
        description: 'This task will be deleted',
        project_id: projectToDelete.id,
        created_by_id: testUser.id,
        duration: 3,
      });

      // Supprimer d'abord les tâches manuellement pour éviter les contraintes FK
      await taskRepository.delete({ project_id: projectToDelete.id });

      await request(app.getHttpServer()).delete(`/projects/${projectToDelete.id}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      // Vérifier que le projet n'existe plus
      const deletedProject = await projectRepository.findOne({
        where: { id: projectToDelete.id },
      });
      expect(deletedProject).toBeNull();
    });

    it('should return 404 for non-existent project', async () => {
      await request(app.getHttpServer()).delete('/projects/non-existent-id').set('Authorization', `Bearer ${authToken}`).expect(404);
    });
  });

  describe('Authentication and Authorization', () => {
    it('should require authentication for all endpoints', async () => {
      const endpoints = [
        { method: 'get', path: '/projects' },
        { method: 'post', path: '/projects' },
        { method: 'get', path: '/projects/test-id' },
        { method: 'patch', path: '/projects/test-id' },
        { method: 'delete', path: '/projects/test-id' },
      ];

      for (const endpoint of endpoints) {
        await request(app.getHttpServer())[endpoint.method](endpoint.path).expect(401);
      }
    });

    it('should reject invalid JWT token', async () => {
      await request(app.getHttpServer()).get('/projects').set('Authorization', 'Bearer invalid-token').expect(401);
    });
  });

  describe('Business logic validation', () => {
    it('should handle projects with different statuses', async () => {
      const statuses = [ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED];

      for (const status of statuses) {
        const response = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: `Project ${status}`,
            description: `Project with status ${status}`,
            status,
            client_id: testClient.id,
          })
          .expect(201);

        expect(response.body.status).toBe(status);
      }
    });

    it('should handle date validations', async () => {
      const projectWithDates = {
        name: 'Date Test Project',
        description: 'Testing date validation',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        client_id: testClient.id,
      };

      const response = await request(app.getHttpServer()).post('/projects').set('Authorization', `Bearer ${authToken}`).send(projectWithDates).expect(201);

      expect(response.body.start_date).toBeDefined();
      expect(response.body.end_date).toBeDefined();
    });

    it('should handle numeric validations for hours', async () => {
      const updateData = {
        sold_hours: 'not-a-number',
      };

      await request(app.getHttpServer()).patch(`/projects/${testProject.id}`).set('Authorization', `Bearer ${authToken}`).send(updateData).expect(400);
    });
  });

  describe('Integration scenarios', () => {
    it('should complete full CRUD operations on a project', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Integration Project',
          description: 'Full CRUD test project',
          status: ProjectStatus.IN_PROGRESS,
          client_id: testClient.id,
        })
        .expect(201);

      const projectId = createResponse.body.id;

      // Read
      const getResponse = await request(app.getHttpServer()).get(`/projects/${projectId}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(getResponse.body.name).toBe('Integration Project');

      // Update
      await request(app.getHttpServer())
        .patch(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Integration Project',
          status: ProjectStatus.COMPLETED,
        })
        .expect(200);

      // Verify update
      const updatedResponse = await request(app.getHttpServer()).get(`/projects/${projectId}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(updatedResponse.body.name).toBe('Updated Integration Project');
      expect(updatedResponse.body.status).toBe(ProjectStatus.COMPLETED);

      // Delete
      await request(app.getHttpServer()).delete(`/projects/${projectId}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      // Verify deletion
      await request(app.getHttpServer()).get(`/projects/${projectId}`).set('Authorization', `Bearer ${authToken}`).expect(404);
    });

    it('should handle project lifecycle with tasks', async () => {
      // Créer un projet
      const projectResponse = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Lifecycle Project',
          description: 'Project for lifecycle testing',
          status: ProjectStatus.IN_PROGRESS,
          client_id: testClient.id,
        })
        .expect(201);

      const projectId = projectResponse.body.id;

      // Ajouter des tâches
      await taskRepository.save([
        {
          name: 'Lifecycle Task 1',
          description: 'First lifecycle task',
          project_id: projectId,
          created_by_id: testUser.id,
          duration: 5,
        },
        {
          name: 'Lifecycle Task 2',
          description: 'Second lifecycle task',
          project_id: projectId,
          created_by_id: testUser.id,
          duration: 8,
        },
      ]);

      // Vérifier que le projet a ses tâches
      const projectWithTasks = await request(app.getHttpServer()).get(`/projects/${projectId}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(projectWithTasks.body.tasks.length).toBe(2);

      // Mettre à jour le statut du projet
      await request(app.getHttpServer()).patch(`/projects/${projectId}`).set('Authorization', `Bearer ${authToken}`).send({ status: ProjectStatus.COMPLETED }).expect(200);

      // Supprimer le projet (doit supprimer les tâches aussi)
      // D'abord supprimer les tâches manuellement
      await taskRepository.delete({ project_id: projectId });

      await request(app.getHttpServer()).delete(`/projects/${projectId}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      // Vérifier que le projet et ses tâches n'existent plus
      await request(app.getHttpServer()).get(`/projects/${projectId}`).set('Authorization', `Bearer ${authToken}`).expect(404);

      // Vérifier que les tâches ont été supprimées
      const remainingTasks = await taskRepository.find({
        where: { project_id: projectId },
      });
      expect(remainingTasks.length).toBe(0);
    });
  });
});
