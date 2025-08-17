import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockUser = {
    sub: 'user-123',
    email: 'test@example.com',
    role: 'CLIENT',
    iat: 1516239022,
    exp: 1516242622,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);

    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true when valid Bearer token is provided', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token-here',
        },
      } as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      mockJwtService.verifyAsync.mockResolvedValue(mockUser);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token-here', {
        secret: process.env.JWT_SECRET,
      });
      expect(mockRequest['user']).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when no authorization header is provided', async () => {
      const mockRequest = {
        headers: {},
      } as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(mockContext)).rejects.toThrow("Token d'authentification manquant");

      expect(mockJwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when JWT verification fails', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(mockContext)).rejects.toThrow("Token d'authentification invalide");

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('invalid-token', {
        secret: process.env.JWT_SECRET,
      });
    });

    it('should throw UnauthorizedException when JWT is expired', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer expired-token',
        },
      } as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      mockJwtService.verifyAsync.mockRejectedValue(new Error('TokenExpiredError'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(mockContext)).rejects.toThrow("Token d'authentification invalide");

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('expired-token', {
        secret: process.env.JWT_SECRET,
      });
    });

    it('should set user payload in request when token is valid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      } as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const customUser = {
        sub: 'custom-user-id',
        email: 'custom@example.com',
        role: 'ADMIN',
        customField: 'customValue',
      };

      mockJwtService.verifyAsync.mockResolvedValue(customUser);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockRequest['user']).toEqual(customUser);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer authorization header', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token-123',
        },
      } as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      mockJwtService.verifyAsync.mockResolvedValue(mockUser);

      guard.canActivate(mockContext);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token-123', {
        secret: process.env.JWT_SECRET,
      });
    });
  });
});
