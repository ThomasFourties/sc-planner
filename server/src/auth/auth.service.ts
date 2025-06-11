import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/dto/user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { firstName, lastName, email, password, confirmPassword, code } =
      registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Déterminer le rôle selon le code fourni
    let role: UserRole = UserRole.CLIENT; // Rôle par défaut
    
    if (code) {
      switch (code.toUpperCase()) {
        case 'XAYOP':
          role = UserRole.SALARIE;
          break;
        case 'PUKXE':
          role = UserRole.FREELANCE;
          break;
        default:
          // Code invalide, on garde le rôle CLIENT par défaut
          break;
      }
    }

    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      isEmailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpires: null,
    });

    await this.userRepository.save(user);

    const roleMessage = this.getRoleMessage(role);
    return {
      message: `Inscription réussie avec le rôle ${roleMessage}. Vous pouvez maintenant vous connecter.`,
    };
  }

  private getRoleMessage(role: UserRole): string {
    switch (role) {
      case UserRole.SALARIE:
        return 'Salarié';
      case UserRole.FREELANCE:
        return 'Freelance';
      case UserRole.CLIENT:
      default:
        return 'Client';
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return {
        message:
          'Si cet email existe, un lien de réinitialisation a été envoyé',
      };
    }

    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;

    await this.userRepository.save(user);
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    return null;
  }
}
