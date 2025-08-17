import { DataSource } from 'typeorm';
import { seedClients } from './clients.seed';
import { seedUsers } from './users.seed';
import { seedProjects } from './projects.seed';
import { seedTasks } from './tasks.seed';
import { config } from 'dotenv';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'your_user',
  password: process.env.DATABASE_PASSWORD || 'your_pass',
  database: process.env.DATABASE_NAME || 'sc_planner',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function runSeed() {
  try {
    await dataSource.initialize();
    console.log('Running seeds...');

    // Exécuter les seeds dans l'ordre pour respecter les relations
    console.log('Seeding clients...');
    await seedClients(dataSource);

    console.log('Seeding users...');
    await seedUsers(dataSource);

    console.log('Seeding projects...');
    await seedProjects(dataSource);

    console.log('Seeding tasks...');
    await seedTasks(dataSource);

    console.log('All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeed();
