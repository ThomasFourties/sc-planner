import {
  IsString,
  IsOptional,
  MaxLength,
  IsArray,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  logo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  website_prod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  website_preprod?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  user_ids?: string[];
}
