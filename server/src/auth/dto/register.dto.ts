import { IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;
}
