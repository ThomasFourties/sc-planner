import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
// import { Task } from '../tasks/entities/task.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'sc-planner-db',
  entities: [User],
  migrations: ['src/database/migrations/**/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
