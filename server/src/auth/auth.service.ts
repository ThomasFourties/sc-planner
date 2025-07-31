import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const {
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      role,
      is_admin,
    } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (!email) {
      throw new BadRequestException('Email requis');
    }

    if (existingUser) {
      throw new ConflictException("L'email est deja associe à un compte");
    }

    if (password !== confirm_password) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.usersService.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: (role as UserRole) || UserRole.CLIENT,
      is_admin: is_admin || false,
    });

    return {
      message: 'Compte créé avec succès',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      is_admin: user.is_admin,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_admin: user.is_admin,
      },
      token,
    };
  }

  async resetPassword(
    token: string,
    new_password: string,
    confirm_password: string,
  ) {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    const user = await this.usersService.findByEmail(decoded.email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (new_password !== confirm_password) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);
    await this.usersService.update(user.id, { password: hashedPassword });

    return {
      message: 'Mot de passe réinitialisé avec succès',
    };
  }
}
