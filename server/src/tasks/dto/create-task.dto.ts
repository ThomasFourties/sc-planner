import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  MaxLength,
  Min,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Nom de la tâche',
    example: 'Développer la fonctionnalité de login',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Description détaillée de la tâche',
    example: "Implémenter le système d'authentification avec JWT",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Durée estimée de la tâche en heures',
    example: 8,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: "ID de l'utilisateur assigné à la tâche",
    example: 'e7f3c4a5-8b2d-4f1e-9c6a-3d5f7e9b2c8a',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  assigned_to_id?: string;

  @ApiProperty({
    description: 'Date de début de la tâche',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    description: 'Date de fin de la tâche',
    example: '2024-01-05T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({
    description: 'Statut de la tâche',
    enum: TaskStatus,
    example: TaskStatus.TODO,
    default: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    description: 'Priorité de la tâche',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    default: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    description: 'ID de la tâche dont cette tâche dépend',
    example: 'e7f3c4a5-8b2d-4f1e-9c6a-3d5f7e9b2c8a',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  dependency_id?: string;
} 