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

// comments

const mockEmailService = {
  sendEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const createTestUser = (email: string) => ({
    first_name: 'John',
    last_name: 'Doe',
    email,
    password: 'password123',
    confirm_password: 'password123',
  });

  const testUser = createTestUser('john.doe@example.com');

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
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer()).post('/auth/register').send(testUser).expect(201);

      expect(response.body).toEqual({
        message: 'Compte créé avec succès',
      });

      const createdUser = await userRepository.findOne({
        where: { email: testUser.email },
      });

      expect(createdUser).toBeDefined();
      expect(createdUser).not.toBeNull();
      expect(createdUser!.first_name).toBe(testUser.first_name);
      expect(createdUser!.last_name).toBe(testUser.last_name);
      expect(createdUser!.email).toBe(testUser.email);
      expect(createdUser!.role).toBe('CLIENT');
      expect(createdUser!.is_admin).toBe(false);
      expect(createdUser!.password).not.toBe(testUser.password);
    });

    it('should fail when email already exists', async () => {
      const uniqueUser = createTestUser('unique.email@example.com');

      await request(app.getHttpServer()).post('/auth/register').send(uniqueUser).expect(201);

      const response = await request(app.getHttpServer()).post('/auth/register').send(uniqueUser).expect(409);

      expect(response.body.message).toBe("L'email est deja associe à un compte");
    });

    it('should fail when passwords do not match', async () => {
      const uniqueUser = createTestUser('password.mismatch@example.com');
      const invalidUser = {
        ...uniqueUser,
        confirm_password: 'differentpassword',
      };

      const response = await request(app.getHttpServer()).post('/auth/register').send(invalidUser).expect(400);

      expect(response.body.message).toBe('Les mots de passe ne correspondent pas');
    });

    it('should fail with invalid email format', async () => {
      const invalidUser = {
        ...testUser,
        email: 'invalid-email',
      };

      const response = await request(app.getHttpServer()).post('/auth/register').send(invalidUser).expect(400);

      expect(response.body.message).toContain('email must be an email');
    });

    it('should fail when password is too short', async () => {
      const invalidUser = {
        ...testUser,
        password: '123',
        confirm_password: '123',
      };

      const response = await request(app.getHttpServer()).post('/auth/register').send(invalidUser).expect(400);

      expect(response.body.message).toContain('Le mot de passe doit contenir au moins 8 caractères');
    });

    it('should fail when required fields are missing', async () => {
      const incompleteUser = {
        email: testUser.email,
        password: testUser.password,
      };

      const response = await request(app.getHttpServer()).post('/auth/register').send(incompleteUser).expect(400);

      expect(response.body.message).toContain('first_name should not be empty');
    });

    it('should fail when email is empty', async () => {
      const uniqueUser = createTestUser('empty.email@example.com');
      const invalidUser = {
        ...uniqueUser,
        email: '',
      };

      const response = await request(app.getHttpServer()).post('/auth/register').send(invalidUser).expect(400);

      expect(response.body.message).toContain('email must be an email');
    });
  });

  describe('/auth/login (POST)', () => {
    let loginUser: any;

    beforeEach(async () => {
      loginUser = createTestUser(`login.test.${Date.now()}@example.com`);
      await request(app.getHttpServer()).post('/auth/register').send(loginUser).expect(201);
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: loginUser.email,
        password: loginUser.password,
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginData).expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(loginUser.email);
      expect(response.body.user.first_name).toBe(loginUser.first_name);
      expect(response.body.user.last_name).toBe(loginUser.last_name);
      expect(response.body.user.role).toBe('CLIENT');
      expect(response.body.user.is_admin).toBe(false);
      expect(typeof response.body.token).toBe('string');

      const decoded = jwtService.verify(response.body.token);
      expect(decoded.email).toBe(loginUser.email);
      expect(decoded.sub).toBeDefined();
    });

    it('should fail with invalid email', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: loginUser.password,
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginData).expect(401);

      expect(response.body.message).toBe('Email ou mot de passe incorrect');
    });

    it('should fail with invalid password', async () => {
      const loginData = {
        email: loginUser.email,
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginData).expect(401);

      expect(response.body.message).toBe('Email ou mot de passe incorrect');
    });

    it('should fail with invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: loginUser.password,
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginData).expect(400);

      expect(response.body.message).toContain('email must be an email');
    });

    it('should fail when email is missing', async () => {
      const loginData = {
        password: loginUser.password,
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginData).expect(400);

      expect(response.body.message).toContain('email must be an email');
    });

    it('should fail when password is missing', async () => {
      const loginData = {
        email: loginUser.email,
      };

      const response = await request(app.getHttpServer()).post('/auth/login').send(loginData).expect(400);

      expect(response.body.message).toContain('password should not be empty');
    });
  });

  describe('/auth/forgot-password (POST)', () => {
    let forgotPasswordUser: any;

    beforeEach(async () => {
      forgotPasswordUser = createTestUser(`forgot.password.${Date.now()}@example.com`);
      await request(app.getHttpServer()).post('/auth/register').send(forgotPasswordUser).expect(201);
    });

    it('should return success message for existing email', async () => {
      const forgotPasswordData = {
        email: forgotPasswordUser.email,
      };

      const response = await request(app.getHttpServer()).post('/auth/forgot-password').send(forgotPasswordData).expect(201);

      expect(response.body.message).toBe('Si le mail est associé à un compte, vous recevrez un lien de réinitialisation.');

      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(forgotPasswordUser.email, expect.any(String));
    });

    it('should return same message for non-existing email (security)', async () => {
      const forgotPasswordData = {
        email: 'nonexistent@example.com',
      };

      const response = await request(app.getHttpServer()).post('/auth/forgot-password').send(forgotPasswordData).expect(201);

      expect(response.body.message).toBe('Si le mail est associé à un compte, vous recevrez un lien de réinitialisation.');

      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should fail with invalid email format', async () => {
      const forgotPasswordData = {
        email: 'invalid-email',
      };

      const response = await request(app.getHttpServer()).post('/auth/forgot-password').send(forgotPasswordData).expect(400);

      expect(response.body.message).toContain('email must be an email');
    });

    it('should fail when email is missing', async () => {
      const response = await request(app.getHttpServer()).post('/auth/forgot-password').send({}).expect(400);

      expect(response.body.message).toContain('email should not be empty');
    });
  });

  describe('/auth/reset-password (POST)', () => {
    let resetToken: string;
    let resetPasswordUser: any;

    beforeEach(async () => {
      resetPasswordUser = createTestUser(`reset.password.${Date.now()}@example.com`);
      await request(app.getHttpServer()).post('/auth/register').send(resetPasswordUser).expect(201);

      resetToken = jwtService.sign({ email: resetPasswordUser.email }, { expiresIn: '1h' });
    });

    it('should reset password successfully with valid token', async () => {
      const resetPasswordData = {
        new_password: 'newpassword123',
        confirm_password: 'newpassword123',
      };

      const response = await request(app.getHttpServer()).post(`/auth/reset-password?token=${resetToken}`).send(resetPasswordData).expect(201);

      expect(response.body.message).toBe('Votre mot de passe a été réinitialisé avec succès.');

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: resetPasswordUser.email,
          password: resetPasswordData.new_password,
        })
        .expect(201);

      expect(loginResponse.body).toHaveProperty('token');
    });

    it('should fail with invalid token', async () => {
      const resetPasswordData = {
        new_password: 'newpassword123',
        confirm_password: 'newpassword123',
      };

      const response = await request(app.getHttpServer()).post('/auth/reset-password?token=invalid-token').send(resetPasswordData).expect(401);

      expect(response.body.message).toBe('Token invalide ou expiré');
    });

    it('should fail when passwords do not match', async () => {
      const resetPasswordData = {
        new_password: 'newpassword123',
        confirm_password: 'differentpassword',
      };

      const response = await request(app.getHttpServer()).post(`/auth/reset-password?token=${resetToken}`).send(resetPasswordData).expect(400);

      expect(response.body.message).toBe('Les mots de passe ne correspondent pas');
    });

    it('should fail when new password is too short', async () => {
      const resetPasswordData = {
        new_password: '123',
        confirm_password: '123',
      };

      const response = await request(app.getHttpServer()).post(`/auth/reset-password?token=${resetToken}`).send(resetPasswordData).expect(400);

      expect(response.body.message).toContain('new_password must be longer than or equal to 8 characters');
    });

    it('should fail when required fields are missing', async () => {
      const response = await request(app.getHttpServer()).post(`/auth/reset-password?token=${resetToken}`).send({}).expect(400);

      expect(response.body.message).toContain('new_password should not be empty');
    });

    it('should fail when token is missing', async () => {
      const resetPasswordData = {
        new_password: 'newpassword123',
        confirm_password: 'newpassword123',
      };

      const response = await request(app.getHttpServer()).post('/auth/reset-password').send(resetPasswordData).expect(401);

      expect(response.body.message).toBe('Token invalide ou expiré');
    });

    it('should fail with expired token', async () => {
      const expiredToken = jwtService.sign({ email: resetPasswordUser.email }, { expiresIn: '-1h' });

      const resetPasswordData = {
        new_password: 'newpassword123',
        confirm_password: 'newpassword123',
      };

      const response = await request(app.getHttpServer()).post(`/auth/reset-password?token=${expiredToken}`).send(resetPasswordData).expect(401);

      expect(response.body.message).toBe('Token invalide ou expiré');
    });
  });

  describe('Integration scenarios', () => {
    it('should complete full registration and login flow', async () => {
      const integrationUser = createTestUser(`integration.flow.${Date.now()}@example.com`);

      await request(app.getHttpServer()).post('/auth/register').send(integrationUser).expect(201);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: integrationUser.email,
          password: integrationUser.password,
        })
        .expect(201);

      expect(loginResponse.body).toHaveProperty('token');
      expect(loginResponse.body.user.email).toBe(integrationUser.email);
    });

    it('should complete full password reset flow', async () => {
      const resetFlowUser = createTestUser(`reset.flow.${Date.now()}@example.com`);

      await request(app.getHttpServer()).post('/auth/register').send(resetFlowUser).expect(201);

      await request(app.getHttpServer()).post('/auth/forgot-password').send({ email: resetFlowUser.email }).expect(201);

      const resetToken = jwtService.sign({ email: resetFlowUser.email }, { expiresIn: '1h' });

      await request(app.getHttpServer())
        .post(`/auth/reset-password?token=${resetToken}`)
        .send({
          new_password: 'newpassword123',
          confirm_password: 'newpassword123',
        })
        .expect(201);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: resetFlowUser.email,
          password: 'newpassword123',
        })
        .expect(201);

      expect(loginResponse.body).toHaveProperty('token');
    });
  });
});
