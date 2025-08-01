import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { EmailService } from '../../src/email/email.service';
import * as nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let mockTransporter: any;
  let mockConfigService: any;

  const mockSendMail = jest.fn();

  beforeEach(async () => {
    // Reset environment variables
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
    delete process.env.EMAIL_HOST;
    delete process.env.EMAIL_PORT;
    delete process.env.EMAIL_SECURE;
    delete process.env.FRONTEND_URL;

    // Mock transporter
    mockTransporter = {
      sendMail: mockSendMail,
    };

    // Mock nodemailer.createTransport
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    // Mock ConfigService
    mockConfigService = {
      get: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create transporter with correct configuration when environment variables are set', () => {
      // Arrange
      process.env.EMAIL_USER = 'test@example.com';
      process.env.EMAIL_PASS = 'password123';
      process.env.EMAIL_HOST = 'smtp.example.com';
      process.env.EMAIL_PORT = '587';
      process.env.EMAIL_SECURE = 'false';

      // Act
      service = new EmailService(mockConfigService);

      // Assert
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@example.com',
          pass: 'password123',
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
      });
    });

    it('should create transporter with secure connection when EMAIL_SECURE is true', () => {
      // Arrange
      process.env.EMAIL_USER = 'test@example.com';
      process.env.EMAIL_PASS = 'password123';
      process.env.EMAIL_HOST = 'smtp.example.com';
      process.env.EMAIL_PORT = '465';
      process.env.EMAIL_SECURE = 'true';

      // Act
      service = new EmailService(mockConfigService);

      // Assert
      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          secure: true,
        })
      );
    });

    it('should throw BadRequestException when EMAIL_USER is missing', () => {
      // Arrange
      process.env.EMAIL_PASS = 'password123';

      // Act & Assert
      expect(() => new EmailService(mockConfigService)).toThrow(
        BadRequestException
      );
      expect(() => new EmailService(mockConfigService)).toThrow(
        'Configuration SMTP manquante.'
      );
    });

    it('should throw BadRequestException when EMAIL_PASS is missing', () => {
      // Arrange
      process.env.EMAIL_USER = 'test@example.com';

      // Act & Assert
      expect(() => new EmailService(mockConfigService)).toThrow(
        BadRequestException
      );
      expect(() => new EmailService(mockConfigService)).toThrow(
        'Configuration SMTP manquante.'
      );
    });

    it('should throw BadRequestException when both EMAIL_USER and EMAIL_PASS are missing', () => {
      // Act & Assert
      expect(() => new EmailService(mockConfigService)).toThrow(
        BadRequestException
      );
      expect(() => new EmailService(mockConfigService)).toThrow(
        'Configuration SMTP manquante.'
      );
    });
  });

  describe('sendPasswordResetEmail', () => {
    beforeEach(() => {
      // Setup environment variables for successful initialization
      process.env.EMAIL_USER = 'test@example.com';
      process.env.EMAIL_PASS = 'password123';
      process.env.EMAIL_HOST = 'smtp.example.com';
      process.env.EMAIL_PORT = '587';
      process.env.EMAIL_SECURE = 'false';
      process.env.FRONTEND_URL = 'https://app.example.com';

      service = new EmailService(mockConfigService);
    });

    it('should send password reset email successfully', async () => {
      // Arrange
      const email = 'user@example.com';
      const token = 'reset-token-123';
      const expectedResetUrl = 'https://app.example.com/reset-password?token=reset-token-123';

      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      // Act
      await service.sendPasswordResetEmail(email, token);

      // Assert
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'SC Planner <noreply@sc-planner.thomasfourties.fr>',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: expect.stringContaining(expectedResetUrl),
      });

      // Verify email content structure
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('Réinitialisation de mot de passe');
      expect(callArgs.html).toContain('Vous avez demandé une réinitialisation de votre mot de passe');
      expect(callArgs.html).toContain('Réinitialiser mon mot de passe');
      expect(callArgs.html).toContain('Ce lien expire dans 1 heure');
      expect(callArgs.html).toContain('Si vous n\'avez pas demandé cette réinitialisation, ignorez cet email');
    });

    it('should handle email sending error gracefully', async () => {
      // Arrange
      const email = 'user@example.com';
      const token = 'reset-token-123';
      const error = new Error('SMTP connection failed');

      mockSendMail.mockRejectedValue(error);

      // Spy on logger.error
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      // Act
      await service.sendPasswordResetEmail(email, token);

      // Assert
      expect(mockSendMail).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        `Échec d'envoi à ${email}`,
        error
      );
    });

    it('should log success message when email is sent', async () => {
      // Arrange
      const email = 'user@example.com';
      const token = 'reset-token-123';

      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      // Spy on logger.log
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.sendPasswordResetEmail(email, token);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(`Email envoyé à ${email}`);
    });

    it('should use correct reset URL with token', async () => {
      // Arrange
      const email = 'user@example.com';
      const token = 'special-token-456';
      const expectedResetUrl = 'https://app.example.com/reset-password?token=special-token-456';

      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      // Act
      await service.sendPasswordResetEmail(email, token);

      // Assert
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(expectedResetUrl);
    });

    it('should handle different frontend URLs', async () => {
      // Arrange
      process.env.FRONTEND_URL = 'https://staging.example.com';
      service = new EmailService(mockConfigService);

      const email = 'user@example.com';
      const token = 'reset-token-123';
      const expectedResetUrl = 'https://staging.example.com/reset-password?token=reset-token-123';

      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      // Act
      await service.sendPasswordResetEmail(email, token);

      // Assert
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(expectedResetUrl);
    });

    it('should include proper HTML structure in email content', async () => {
      // Arrange
      const email = 'user@example.com';
      const token = 'reset-token-123';

      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      // Act
      await service.sendPasswordResetEmail(email, token);

      // Assert
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">');
      expect(callArgs.html).toContain('<h2>Réinitialisation de mot de passe</h2>');
      expect(callArgs.html).toContain('<a href="');
      expect(callArgs.html).toContain('style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;"');
    });
  });

  describe('integration scenarios', () => {
    it('should handle special characters in email addresses', async () => {
      // Arrange
      process.env.EMAIL_USER = 'test@example.com';
      process.env.EMAIL_PASS = 'password123';
      process.env.EMAIL_HOST = 'smtp.example.com';
      process.env.EMAIL_PORT = '587';
      process.env.EMAIL_SECURE = 'false';
      process.env.FRONTEND_URL = 'https://app.example.com';

      service = new EmailService(mockConfigService);

      const email = 'user+test@example.com';
      const token = 'reset-token-123';

      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      // Act
      await service.sendPasswordResetEmail(email, token);

      // Assert
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
        })
      );
    });

    it('should handle long tokens', async () => {
      // Arrange
      process.env.EMAIL_USER = 'test@example.com';
      process.env.EMAIL_PASS = 'password123';
      process.env.EMAIL_HOST = 'smtp.example.com';
      process.env.EMAIL_PORT = '587';
      process.env.EMAIL_SECURE = 'false';
      process.env.FRONTEND_URL = 'https://app.example.com';

      service = new EmailService(mockConfigService);

      const email = 'user@example.com';
      const longToken = 'a'.repeat(1000);

      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      // Act
      await service.sendPasswordResetEmail(email, longToken);

      // Assert
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain(longToken);
    });
  });
}); 