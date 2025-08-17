import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../src/users/entities/user.entity';
import { Client } from '../../src/clients/entities/client.entity';
import { Project } from '../../src/projects/entities/project.entity';
import { Task, TaskStatus, TaskPriority } from '../../src/tasks/entities/task.entity';
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

describe('TasksController (e2e)', () => {
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

    // Créer les données de test
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
      description: 'Client for testing tasks',
    });

    // Créer un utilisateur de test
    testUser = await userRepository.save({
      first_name: 'John',
      last_name: 'Doe',
      email: `tasks-${Date.now()}@example.com`, // Email unique
      password: '$2b$10$hashedpassword',
      role: UserRole.CLIENT,
      is_admin: false,
      client_id: testClient.id,
    });

    // Créer un projet de test
    testProject = await projectRepository.save({
      name: 'Test Project',
      description: 'Project for testing tasks',
      status: ProjectStatus.IN_PROGRESS,
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-12-31'),
      sold_hours: 100,
      spent_hours: 50,
      client_id: testClient.id,
    });

    // Générer un token JWT
    authToken = jwtService.sign({ email: testUser.email, sub: testUser.id });
  }

  describe('POST /tasks', () => {
    it('should create a new task successfully', async () => {
      const createTaskDto = {
        name: 'New Task',
        description: 'Task description',
        project_id: testProject.id,
        duration: 10,
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
      };

      const response = await request(app.getHttpServer()).post('/tasks').set('Authorization', `Bearer ${authToken}`).send(createTaskDto).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createTaskDto.name);
      expect(response.body.description).toBe(createTaskDto.description);
      expect(response.body.project_id).toBe(createTaskDto.project_id);
      expect(response.body.created_by_id).toBe(testUser.id);
      expect(Number(response.body.duration)).toBe(createTaskDto.duration);

      // Vérifier en base
      const savedTask = await taskRepository.findOne({
        where: { id: response.body.id },
      });
      expect(savedTask).toBeDefined();
      expect(savedTask!.name).toBe(createTaskDto.name);
    });

    it('should fail when not authenticated', async () => {
      const createTaskDto = {
        name: 'New Task',
        description: 'Task description',
        project_id: testProject.id,
      };

      await request(app.getHttpServer()).post('/tasks').send(createTaskDto).expect(401);
    });

    it('should fail with invalid project_id', async () => {
      const createTaskDto = {
        name: 'New Task',
        description: 'Task description',
        project_id: 'invalid-project-id',
      };

      await request(app.getHttpServer()).post('/tasks').set('Authorization', `Bearer ${authToken}`).send(createTaskDto).expect(400);
    });

    it('should fail when required fields are missing', async () => {
      const incompleteTask = {
        description: 'Task without name',
      };

      await request(app.getHttpServer()).post('/tasks').set('Authorization', `Bearer ${authToken}`).send(incompleteTask).expect(400);
    });
  });

  describe('GET /tasks', () => {
    it('should get all tasks', async () => {
      // Créer quelques tâches de test
      await taskRepository.save([
        {
          name: 'Task 1',
          description: 'Description 1',
          project_id: testProject.id,
          created_by_id: testUser.id,
          duration: 5,
        },
        {
          name: 'Task 2',
          description: 'Description 2',
          project_id: testProject.id,
          created_by_id: testUser.id,
          duration: 8,
        },
      ]);

      const response = await request(app.getHttpServer()).get('/tasks').set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);

      const task1 = response.body.find((t) => t.name === 'Task 1');
      expect(task1).toBeDefined();
      expect(task1.description).toBe('Description 1');
    });

    it('should fail when accessing protected endpoint without authentication', async () => {
      await request(app.getHttpServer()).get('/tasks/my-tasks').expect(401);
    });
  });

  describe('GET /tasks/my-tasks', () => {
    it('should get current user tasks only', async () => {
      // Créer un autre utilisateur et ses tâches
      const otherUser = await userRepository.save({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        password: '$2b$10$hashedpassword',
        role: UserRole.CLIENT,
        is_admin: false,
        client_id: testClient.id,
      });

      await taskRepository.save([
        {
          name: 'My Task',
          description: 'My task description',
          project_id: testProject.id,
          created_by_id: testUser.id,
          assigned_to_id: testUser.id,
          duration: 3,
        },
        {
          name: 'Other Task',
          description: 'Other task description',
          project_id: testProject.id,
          created_by_id: otherUser.id,
          assigned_to_id: otherUser.id,
          duration: 4,
        },
      ]);

      const response = await request(app.getHttpServer()).get('/tasks/my-tasks').set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // Les tâches retournées doivent être liées au user connecté
      const myTask = response.body.find((t) => t.name === 'My Task');
      expect(myTask).toBeDefined();
    });
  });

  describe('GET /tasks/project/:projectId', () => {
    it('should get tasks by project', async () => {
      // Créer un autre projet
      const otherProject = await projectRepository.save({
        name: 'Other Project',
        description: 'Another project',
        status: ProjectStatus.IN_PROGRESS,
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        sold_hours: 50,
        spent_hours: 25,
        client_id: testClient.id,
      });

      await taskRepository.save([
        {
          name: 'Project Task',
          description: 'Task in specific project',
          project_id: testProject.id,
          created_by_id: testUser.id,
          duration: 6,
        },
        {
          name: 'Other Project Task',
          description: 'Task in other project',
          project_id: otherProject.id,
          created_by_id: testUser.id,
          duration: 7,
        },
      ]);

      const response = await request(app.getHttpServer()).get(`/tasks/project/${testProject.id}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // Toutes les tâches doivent appartenir au projet spécifié
      response.body.forEach((task) => {
        expect(task.project_id).toBe(testProject.id);
      });

      const projectTask = response.body.find((t) => t.name === 'Project Task');
      expect(projectTask).toBeDefined();
    });

    it('should return empty array for non-existent project', async () => {
      const fakeProjectId = '123e4567-e89b-12d3-a456-426614174000';
      const response = await request(app.getHttpServer()).get(`/tasks/project/${fakeProjectId}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should get a specific task', async () => {
      const task = await taskRepository.save({
        name: 'Specific Task',
        description: 'Specific task description',
        project_id: testProject.id,
        created_by_id: testUser.id,
        duration: 12,
      });

      const response = await request(app.getHttpServer()).get(`/tasks/${task.id}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(response.body.id).toBe(task.id);
      expect(response.body.name).toBe('Specific Task');
      expect(response.body.description).toBe('Specific task description');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeTaskId = '123e4567-e89b-12d3-a456-426614174000';
      await request(app.getHttpServer()).get(`/tasks/${fakeTaskId}`).set('Authorization', `Bearer ${authToken}`).expect(404);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task', async () => {
      const task = await taskRepository.save({
        name: 'Original Task',
        description: 'Original description',
        project_id: testProject.id,
        created_by_id: testUser.id,
        duration: 5,
        status: TaskStatus.TODO,
      });

      const updateData = {
        name: 'Updated Task',
        description: 'Updated description',
        status: TaskStatus.IN_PROGRESS,
        duration: 8,
      };

      const response = await request(app.getHttpServer()).patch(`/tasks/${task.id}`).set('Authorization', `Bearer ${authToken}`).send(updateData).expect(200);

      expect(response.body.name).toBe('Updated Task');
      expect(response.body.description).toBe('Updated description');
      expect(response.body.status).toBe(TaskStatus.IN_PROGRESS);

      // Vérifier en base
      const updatedTask = await taskRepository.findOne({
        where: { id: task.id },
      });
      expect(updatedTask).toBeDefined();
      expect(updatedTask!.name).toBe('Updated Task');
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer()).patch('/tasks/non-existent-id').set('Authorization', `Bearer ${authToken}`).send({ name: 'Updated' }).expect(404);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task using PUT method', async () => {
      const task = await taskRepository.save({
        name: 'Original Task PUT',
        description: 'Original description PUT',
        project_id: testProject.id,
        created_by_id: testUser.id,
        duration: 10,
      });

      const updateData = {
        name: 'Updated Task PUT',
        description: 'Updated description PUT',
        duration: 15,
      };

      const response = await request(app.getHttpServer()).put(`/tasks/${task.id}`).set('Authorization', `Bearer ${authToken}`).send(updateData).expect(200);

      expect(response.body.name).toBe('Updated Task PUT');
      expect(response.body.description).toBe('Updated description PUT');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await taskRepository.save({
        name: 'Task to Delete',
        description: 'This task will be deleted',
        project_id: testProject.id,
        created_by_id: testUser.id,
        duration: 2,
      });

      await request(app.getHttpServer()).delete(`/tasks/${task.id}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      // Vérifier que la tâche n'existe plus
      const deletedTask = await taskRepository.findOne({
        where: { id: task.id },
      });
      expect(deletedTask).toBeNull();
    });

    it('should return 404 for non-existent task', async () => {
      await request(app.getHttpServer()).delete('/tasks/non-existent-id').set('Authorization', `Bearer ${authToken}`).expect(404);
    });
  });

  describe('Task Status and Priority validation', () => {
    it('should handle all valid task statuses', async () => {
      const statuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.BLOCKED, TaskStatus.CANCELLED];

      for (const status of statuses) {
        const response = await request(app.getHttpServer())
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: `Task ${status}`,
            description: `Task with status ${status}`,
            project_id: testProject.id,
            status,
            duration: 1,
          })
          .expect(201);

        expect(response.body.status).toBe(status);
      }
    });

    it('should handle all valid task priorities', async () => {
      const priorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT];

      for (const priority of priorities) {
        const response = await request(app.getHttpServer())
          .post('/tasks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: `Task ${priority}`,
            description: `Task with priority ${priority}`,
            project_id: testProject.id,
            priority,
            duration: 1,
          })
          .expect(201);

        expect(response.body.priority).toBe(priority);
      }
    });
  });

  describe('Authentication and Authorization', () => {
    it('should require authentication for all endpoints', async () => {
      const endpoints = [
        { method: 'get', path: '/tasks' },
        { method: 'post', path: '/tasks' },
        { method: 'get', path: '/tasks/my-tasks' },
        { method: 'get', path: '/tasks/project/test' },
        { method: 'get', path: '/tasks/test-id' },
        { method: 'patch', path: '/tasks/test-id' },
        { method: 'put', path: '/tasks/test-id' },
        { method: 'delete', path: '/tasks/test-id' },
      ];

      for (const endpoint of endpoints) {
        await request(app.getHttpServer())[endpoint.method](endpoint.path).expect(401);
      }
    });

    it('should reject invalid JWT token', async () => {
      await request(app.getHttpServer()).get('/tasks').set('Authorization', 'Bearer invalid-token').expect(401);
    });
  });

  describe('Integration scenarios', () => {
    it('should complete full CRUD operations on a task', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Integration Task',
          description: 'Full CRUD test',
          project_id: testProject.id,
          duration: 20,
        })
        .expect(201);

      const taskId = createResponse.body.id;

      // Read
      const getResponse = await request(app.getHttpServer()).get(`/tasks/${taskId}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(getResponse.body.name).toBe('Integration Task');

      // Update
      await request(app.getHttpServer()).patch(`/tasks/${taskId}`).set('Authorization', `Bearer ${authToken}`).send({ name: 'Updated Integration Task' }).expect(200);

      // Verify update
      const updatedResponse = await request(app.getHttpServer()).get(`/tasks/${taskId}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(updatedResponse.body.name).toBe('Updated Integration Task');

      // Delete
      await request(app.getHttpServer()).delete(`/tasks/${taskId}`).set('Authorization', `Bearer ${authToken}`).expect(200);

      // Verify deletion
      await request(app.getHttpServer()).get(`/tasks/${taskId}`).set('Authorization', `Bearer ${authToken}`).expect(404);
    });
  });
});
