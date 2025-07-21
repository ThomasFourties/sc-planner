import { IsUUID, IsOptional } from 'class-validator';

export class AssignClientDto {
  @IsOptional()
  @IsUUID()
  client_id?: string;
} 