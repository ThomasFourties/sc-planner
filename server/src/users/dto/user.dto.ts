import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export enum UserRole {
  SALARIE = 'SALARIE',
  FREELANCE = 'FREELANCE',
  CLIENT = 'CLIENT',
}

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;

  @IsString()
  @IsOptional()
  profile_img?: string;
}
