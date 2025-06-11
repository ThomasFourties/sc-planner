import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/dto/user.dto';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.CHEF_DE_PROJET,
      is_admin: true,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.SALARIE,
      is_admin: false,
    },
    {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.FREELANCE,
      is_admin: false,
    },
    {
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice.brown@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.CLIENT,
      is_admin: false,
    },
  ];

  for (const user of users) {
    const existingUser = await userRepository.findOne({
      where: { email: user.email },
    });
    if (!existingUser) {
      await userRepository.save(user);
    }
  }
}
