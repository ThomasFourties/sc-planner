import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: 'John',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    description: "Nom de famille de l'utilisateur",
    example: 'Doe',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Mot de passe (minimum 8 caractères, avec majuscule, minuscule et chiffre)',
    example: 'Password123',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre',
  })
  password: string;

  @ApiProperty({
    description: 'Confirmation du mot de passe',
    example: 'Password123',
  })
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    description: "Code d'accès optionnel pour validation côté client",
    example: 'XAYOP',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: "Rôle de l'utilisateur déterminé par le code",
    example: 'Salarié',
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({
    description: "Indique si l'utilisateur est administrateur (chef de projet)",
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
