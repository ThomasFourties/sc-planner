import { registerAs } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
// import { Task } from '../tasks/entities/task.entity';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || '5432',
  username: process.env.DATABASE_USER || 'your_user',
  password: process.env.DATABASE_PASSWORD || 'your_pass',
  database: process.env.DATABASE_NAME || 'sc_planner',
  entities: [User],
  // synchronize: process.env.NODE_ENV !== 'production',
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
}));
