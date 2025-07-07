import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  new_password: string;

  @IsNotEmpty()
  @IsString()
  confirm_password: string;
}
