import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  TODO = 'todo',
  BLOCKED = 'blocked',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('tasks')
export class Task {
  @ApiProperty({
    description: 'Identifiant unique de la tâche',
    example: 'e7f3c4a5-8b2d-4f1e-9c6a-3d5f7e9b2c8a',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nom de la tâche',
    example: 'Développer la fonctionnalité de login',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Description détaillée de la tâche',
    example: "Implémenter le système d'authentification avec JWT",
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Durée estimée de la tâche en heures',
    example: 8,
    minimum: 0,
  })
  @Column({ type: 'int', default: 0 })
  duration: number;

  @ApiProperty({
    description: "ID de l'utilisateur assigné à la tâche",
    example: 'e7f3c4a5-8b2d-4f1e-9c6a-3d5f7e9b2c8a',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  assigned_to_id?: string;

  @ApiProperty({
    description: 'Utilisateur assigné à la tâche',
    type: () => User,
    required: false,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assigned_to?: User;

  @ApiProperty({
    description: "ID de l'utilisateur qui a créé la tâche",
    example: 'e7f3c4a5-8b2d-4f1e-9c6a-3d5f7e9b2c8a',
  })
  @Column({ type: 'uuid' })
  created_by_id: string;

  @ApiProperty({
    description: 'Utilisateur qui a créé la tâche',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @ApiProperty({
    description: 'Date de début de la tâche',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @Column({ type: 'timestamp', nullable: true })
  start_date?: Date;

  @ApiProperty({
    description: 'Date de fin de la tâche',
    example: '2024-01-05T00:00:00.000Z',
    required: false,
  })
  @Column({ type: 'timestamp', nullable: true })
  end_date?: Date;

  @ApiProperty({
    description: 'Statut de la tâche',
    enum: TaskStatus,
    example: TaskStatus.TODO,
    default: TaskStatus.TODO,
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Priorité de la tâche',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    default: TaskPriority.MEDIUM,
  })
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'ID de la tâche dont cette tâche dépend',
    example: 'e7f3c4a5-8b2d-4f1e-9c6a-3d5f7e9b2c8a',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  dependency_id?: string;

  @ApiProperty({
    description: 'Tâche dont cette tâche dépend',
    type: () => Task,
    required: false,
  })
  @ManyToOne(() => Task, { nullable: true })
  @JoinColumn({ name: 'dependency_id' })
  dependency?: Task;

  @ApiProperty({
    description: 'Date de création de la tâche',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour de la tâche',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
