import { registerAs } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
// import { Task } from '../tasks/entities/task.entity';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || '5432',
  username: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'sc-planner-db',
  entities: [User],
  // synchronize: process.env.NODE_ENV !== 'production',
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
}));
