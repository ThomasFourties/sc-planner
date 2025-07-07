import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

// Import bcrypt after mocking
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockedToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks(); // clean mocks between tests
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ id: 1 });

      const dto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password',
        role: undefined,
        is_admin: undefined,
      };

      const result = await service.register(dto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: dto.first_name,
          last_name: dto.last_name,
          email: dto.email,
          password: 'hashed_password',
          role: 'CLIENT',
          is_admin: false,
        }),
      );
      expect(result).toBeUndefined();
    });

    it('should register a user with custom role and admin status', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ id: 1 });

      const dto = {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: 'password',
        role: 'ADMIN',
        is_admin: true,
      };

      await service.register(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'ADMIN',
          is_admin: true,
        }),
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'john@example.com',
      });

      const dto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password',
        role: undefined,
        is_admin: undefined,
      };

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      await expect(service.register(dto)).rejects.toThrow(
        'Un utilisateur avec cet email existe déjà',
      );

      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login a user and return token + user', async () => {
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        password: 'hashed_password',
        first_name: 'John',
        last_name: 'Doe',
        role: 'CLIENT',
        is_admin: false,
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const dto = {
        email: 'john@example.com',
        password: 'password',
      };

      const result = await service.login(dto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        is_admin: mockUser.is_admin,
      });

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          first_name: mockUser.first_name,
          last_name: mockUser.last_name,
          email: mockUser.email,
          role: mockUser.role,
          is_admin: mockUser.is_admin,
        },
        token: 'mockedToken',
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const dto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(dto)).rejects.toThrow(
        'Email ou mot de passe incorrect',
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'john@example.com',
        password: 'hashed_password',
        first_name: 'John',
        last_name: 'Doe',
        role: 'CLIENT',
        is_admin: false,
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Invalid password

      const dto = {
        email: 'john@example.com',
        password: 'wrong_password',
      };

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(dto)).rejects.toThrow(
        'Email ou mot de passe incorrect',
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});
