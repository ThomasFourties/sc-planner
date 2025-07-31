import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockedToken'),
    verify: jest.fn(),
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

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('valid-jwt-token');

      const loginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await service.login(loginDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
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
        token: 'valid-jwt-token',
      });
    });

    it('should throw UnauthorizedException when email does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Email ou mot de passe incorrect',
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const loginDto = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      await expect(service.login(loginDto)).rejects.toThrow(
        'Email ou mot de passe incorrect',
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully with valid token', async () => {
      const mockDecodedToken = { email: 'john@example.com' };
      mockJwtService.verify.mockReturnValue(mockDecodedToken);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue(mockUser);

      const token = 'valid-reset-token';
      const newPassword = 'newpassword123';
      const confirmPassword = 'newpassword123';

      const result = await service.resetPassword(
        token,
        newPassword,
        confirmPassword,
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        mockDecodedToken.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
      expect(mockUsersService.update).toHaveBeenCalledWith(mockUser.id, {
        password: 'hashed_password',
      });
      expect(result).toEqual({
        message: 'Mot de passe réinitialisé avec succès',
      });
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const token = 'invalid-token';
      const newPassword = 'newpassword123';
      const confirmPassword = 'newpassword123';

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow('Token invalide ou expiré');

      expect(mockUsersService.findByEmail).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const mockDecodedToken = { email: 'nonexistent@example.com' };
      mockJwtService.verify.mockReturnValue(mockDecodedToken);
      mockUsersService.findByEmail.mockResolvedValue(null);

      const token = 'valid-token';
      const newPassword = 'newpassword123';
      const confirmPassword = 'newpassword123';

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow('Utilisateur introuvable');

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      const mockDecodedToken = { email: 'john@example.com' };
      mockJwtService.verify.mockReturnValue(mockDecodedToken);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const token = 'valid-token';
      const newPassword = 'newpassword123';
      const confirmPassword = 'differentpassword';

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow('Les mots de passe ne correspondent pas');

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should return success message when user exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('reset-token');

      const email = 'john@example.com';

      const result = await service.forgotPassword(email);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { email },
        { expiresIn: '1h' },
      );
      expect(result).toEqual({
        message:
          'Si le mail est associé à un compte, vous recevrez un lien de réinitialisation.',
      });
    });

    it('should return success message when user does not exist (security)', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const email = 'nonexistent@example.com';

      const result = await service.forgotPassword(email);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
      expect(result).toEqual({
        message:
          'Si le mail est associé à un compte, vous recevrez un lien de réinitialisation.',
      });
    });
  });
});
