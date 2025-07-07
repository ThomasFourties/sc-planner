import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  password: string;

  @IsNotEmpty()
  confirm_password: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;
}
