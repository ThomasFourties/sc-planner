import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  SALARIE = 'SALARIE',
  FREELANCE = 'FREELANCE',
  CLIENT = 'CLIENT',
}

export class UserDTO {
  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'John',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Doe',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur dans le système',
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    description: 'Statut administrateur de l\'utilisateur',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;

  @ApiProperty({
    description: 'URL de l\'image de profil',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profile_img?: string;
}
