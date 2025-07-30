import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

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
        password: 'password',
        confirm_password: 'password',
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
      expect(result).toEqual({
        message: 'Compte créé avec succès',
      });
    });

    it('should register a user with custom role and admin status', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        ...mockUser,
        role: 'CHEF_DE_PROJET',
        is_admin: true,
      });

      const dto = {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: 'password',
        confirm_password: 'password',
        role: 'CHEF_DE_PROJET',
        is_admin: true,
      };

      const result = await service.register(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'CHEF_DE_PROJET',
          is_admin: true,
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
        password: 'password',
        confirm_password: 'password',
        role: undefined,
        is_admin: undefined,
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
        role: undefined,
        is_admin: undefined,
      };

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
      await expect(service.register(dto)).rejects.toThrow(
        'Les mots de passe ne correspondent pas',
      );

      expect(mockUsersService.create).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should register with FREELANCE role', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        ...mockUser,
        role: 'FREELANCE',
      });

      const dto = {
        first_name: 'John',
        last_name: 'Freelancer',
        email: 'freelancer@example.com',
        password: 'password',
        confirm_password: 'password',
        role: 'FREELANCE',
        is_admin: false,
      };

      const result = await service.register(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'FREELANCE',
          is_admin: false,
        }),
      );
      expect(result).toEqual({
        message: 'Compte créé avec succès',
      });
    });

    it('should register with SALARIE role', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        ...mockUser,
        role: 'SALARIE',
      });

      const dto = {
        first_name: 'John',
        last_name: 'Employee',
        email: 'employee@example.com',
        password: 'password',
        confirm_password: 'password',
        role: 'SALARIE',
        is_admin: false,
      };

      const result = await service.register(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'SALARIE',
          is_admin: false,
        }),
      );
      expect(result).toEqual({
        message: 'Compte créé avec succès',
      });
    });
  });

  describe('login', () => {
    it('should login a user and return token + user', async () => {
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

    it('should login an admin user successfully', async () => {
      const adminUser = {
        ...mockUser,
        role: 'CHEF_DE_PROJET',
        is_admin: true,
      };

      mockUsersService.findByEmail.mockResolvedValue(adminUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const dto = {
        email: 'admin@example.com',
        password: 'password',
      };

      const result = await service.login(dto);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        is_admin: adminUser.is_admin,
      });

      expect(result.user.is_admin).toBe(true);
      expect(result.user.role).toBe('CHEF_DE_PROJET');
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
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

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

    it('should handle case-sensitive email comparison', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const dto = {
        email: 'JOHN@EXAMPLE.COM', // Uppercase email
        password: 'password',
      };

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'JOHN@EXAMPLE.COM',
      );
    });
  });

  describe('resetPassword', () => {
    const validToken = 'valid.jwt.token';
    const decodedToken = {
      email: 'john@example.com',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    };

    it('should reset password successfully', async () => {
      mockJwtService.verify.mockReturnValue(decodedToken);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue({ affected: 1 });
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');

      const result = await service.resetPassword(
        validToken,
        'newpassword123',
        'newpassword123',
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith(validToken);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        decodedToken.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 12);
      expect(mockUsersService.update).toHaveBeenCalledWith(mockUser.id, {
        password: 'new_hashed_password',
      });
      expect(result).toEqual({
        message: 'Mot de passe réinitialisé avec succès',
      });
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        service.resetPassword('invalid.token', 'newpassword', 'newpassword'),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.resetPassword('invalid.token', 'newpassword', 'newpassword'),
      ).rejects.toThrow('Token invalide ou expiré');

      expect(mockUsersService.findByEmail).not.toHaveBeenCalled();
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token is expired', async () => {
      mockJwtService.verify.mockImplementation(() => {
        const error = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await expect(
        service.resetPassword('expired.token', 'newpassword', 'newpassword'),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.resetPassword('expired.token', 'newpassword', 'newpassword'),
      ).rejects.toThrow('Token invalide ou expiré');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockJwtService.verify.mockReturnValue(decodedToken);
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.resetPassword(validToken, 'newpassword', 'newpassword'),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.resetPassword(validToken, 'newpassword', 'newpassword'),
      ).rejects.toThrow('Utilisateur introuvable');

      expect(mockUsersService.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      mockJwtService.verify.mockReturnValue(decodedToken);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.resetPassword(
          validToken,
          'newpassword123',
          'differentpassword',
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.resetPassword(
          validToken,
          'newpassword123',
          'differentpassword',
        ),
      ).rejects.toThrow('Les mots de passe ne correspondent pas');

      expect(mockUsersService.update).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should handle malformed token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      await expect(
        service.resetPassword('malformed.token', 'newpassword', 'newpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle different JWT errors', async () => {
      const jwtErrors = [
        'JsonWebTokenError',
        'NotBeforeError',
        'TokenExpiredError',
      ];

      for (const errorName of jwtErrors) {
        mockJwtService.verify.mockImplementation(() => {
          const error = new Error('JWT error');
          error.name = errorName;
          throw error;
        });

        await expect(
          service.resetPassword('error.token', 'newpassword', 'newpassword'),
        ).rejects.toThrow(UnauthorizedException);

        jest.clearAllMocks();
      }
    });

    it('should hash new password with correct salt rounds', async () => {
      mockJwtService.verify.mockReturnValue(decodedToken);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue({ affected: 1 });

      await service.resetPassword(validToken, 'mynewpassword', 'mynewpassword');

      expect(bcrypt.hash).toHaveBeenCalledWith('mynewpassword', 12);
    });

    it('should work with complex passwords', async () => {
      mockJwtService.verify.mockReturnValue(decodedToken);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue({ affected: 1 });
      // Mock spécifique pour ce test
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(
        'complex_hashed_password',
      );

      const complexPassword = 'MyC0mpl3x!P@ssw0rd#2023';

      await service.resetPassword(validToken, complexPassword, complexPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(complexPassword, 12);
      expect(mockUsersService.update).toHaveBeenCalledWith(mockUser.id, {
        password: 'complex_hashed_password',
      });
    });
  });
});
