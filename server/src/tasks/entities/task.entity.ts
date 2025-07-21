import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

export enum TaskStatus {
  BLOCKED = 'blocked',
  WAITING_FOR_INFO = 'waiting_for_info',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  PROCESSED_PREPROD = 'processed_preprod',
  PROCESSED_PROD = 'processed_prod',
  TO_VALIDATE = 'to_validate',
  VALIDATED = 'validated',
  CANCELLED = 'cancelled',
  TO_TIMER = 'to_timer',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  duration: number;

  @Column({ name: 'assigned_to_id', nullable: true })
  assigned_to_id?: string;

  @Column({ name: 'created_by_id' })
  created_by_id: string;

  @Column({ name: 'project_id', nullable: true })
  project_id?: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  start_date?: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  end_date?: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({ name: 'dependency_id', nullable: true })
  dependency_id?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to_id' })
  assigned_to?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @ManyToOne(() => Project, (project) => project.tasks, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @ManyToOne(() => Task, { nullable: true })
  @JoinColumn({ name: 'dependency_id' })
  dependency?: Task;
}
