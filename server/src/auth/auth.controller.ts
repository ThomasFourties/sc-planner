import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
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
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const token = this.jwtService.sign({ email }, { expiresIn: '1h' });
      await this.emailService.sendPasswordResetEmail(email, token);
    }

    return {
      message:
        'Si le mail est associé à un compte, vous recevrez un lien de réinitialisation.',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() { new_password, confirm_password }: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(token, new_password, confirm_password);

    return {
      message: 'Votre mot de passe a été réinitialisé avec succès.',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findByEmail(req.user.email);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_admin: user.is_admin,
    };
  }
}
