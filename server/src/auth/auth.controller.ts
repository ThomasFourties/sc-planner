import { Controller, Post, Body, Query, Res, Request, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto);

    this.logger.log(`Connexion réussie pour: ${loginDto.email} (ID: ${result.user.id})`);

    // Configuration cookie pour HTTPS avec variables d'environnement
    res.cookie('auth-token', result.access_token, {
      httpOnly: process.env.COOKIE_HTTPONLY === 'true' || true,
      secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
      sameSite: (process.env.COOKIE_SAMESITE as any) || 'lax',
      domain: process.env.COOKIE_DOMAIN || undefined, // Si undefined, utilisera le domaine actuel
      maxAge: 24 * 60 * 60 * 1000, // 24h
    });

    this.logger.log(`Cookie défini avec domaine: ${process.env.COOKIE_DOMAIN}, secure: ${process.env.COOKIE_SECURE}`);

    return res.json(result);
  }

  @Post('logout')
  async logout() {
    this.logger.log('Déconnexion demandée');

    return {
      message: 'Déconnexion réussie',
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const token = this.jwtService.sign({ email }, { expiresIn: '1h' });
      await this.emailService.sendPasswordResetEmail(email, token);
    }

    return {
      message: 'Si le mail est associé à un compte, vous recevrez un lien de réinitialisation.',
    };
  }

  @Post('reset-password')
  async resetPassword(@Query('token') token: string, @Body() { new_password, confirm_password }: ResetPasswordDto) {
    await this.authService.resetPassword(token, new_password, confirm_password);

    return {
      message: 'Votre mot de passe a été réinitialisé avec succès.',
    };
  }
}
