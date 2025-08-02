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
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Tentative de connexion pour: ${loginDto.email}`);

    const result = await this.authService.login(loginDto);

    this.logger.log(`Connexion réussie pour: ${result.user.email} (ID: ${result.user.id})`);

    // Retourner le token pour que Nuxt puisse le gérer
    return {
      message: 'Connexion réussie',
      user: result.user,
      token: result.token, // Retourner le token pour Nuxt
    };
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
