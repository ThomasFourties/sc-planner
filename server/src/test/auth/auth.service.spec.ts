import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, BadRequestException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

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

  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'john@example.com',
    password: 'hashed_password',
    first_name: 'John',
    last_name: 'Doe',
    role: 'CLIENT',
    is_admin: false,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
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

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const dto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirm_password: 'password123',
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
      expect(result).toEqual({
        message: 'Compte créé avec succès',
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const dto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirm_password: 'password123',
      };

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      await expect(service.register(dto)).rejects.toThrow(
        "L'email est deja associe à un compte",
      );

      expect(mockUsersService.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const dto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirm_password: 'differentpassword',
      };

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
      await expect(service.register(dto)).rejects.toThrow(
        'Les mots de passe ne correspondent pas',
      );

      expect(mockUsersService.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when email is not provided', async () => {
      const dto = {
        first_name: 'John',
        last_name: 'Doe',
        email: '',
        password: 'password123',
        confirm_password: 'password123',
      };

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
      await expect(service.register(dto)).rejects.toThrow('Email requis');
    });
  });
});
