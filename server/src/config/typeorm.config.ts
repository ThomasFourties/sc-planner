import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { Client } from '../clients/entities/client.entity';
import { Project } from '../projects/entities/project.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'your_user',
  password: process.env.DATABASE_PASSWORD || 'your_pass',
  database: process.env.DATABASE_NAME || 'sc_planner',
  entities: [User, Task, Client, Project],
  migrations: ['src/database/migrations/**/*.ts'],
  // synchronize: process.env.NODE_ENV !== 'production',
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
});
