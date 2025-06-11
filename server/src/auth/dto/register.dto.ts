import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'John',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Doe',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mot de passe (minimum 8 caractères, avec majuscule, minuscule et chiffre)',
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
    description: 'Code d\'accès pour déterminer le rôle (XAYOP=Salarié, PUKXE=Freelance, vide=Client)',
    example: 'XAYOP',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;
}
