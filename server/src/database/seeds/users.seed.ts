import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { Client } from '../../clients/entities/client.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const clientRepository = dataSource.getRepository(Client);

  // Récupérer les clients pour les assigner aux utilisateurs
  const clients = await clientRepository.find();

  const users = [
    {
      first_name: 'Thomas',
      last_name: 'Fourties',
      email: 'thomas.fourties@icloud.com',
      password: await bcrypt.hash('azaz', 10),
      role: UserRole.CHEF_DE_PROJET,
      is_admin: true,
      client_id: undefined, // Admin n'a pas de client assigné
    },
    {
      first_name: 'Marie',
      last_name: 'Dubois',
      email: 'marie.dubois@techcorp.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.CHEF_DE_PROJET,
      is_admin: false,
      client_id: clients[0]?.id, // TechCorp Solutions
    },
    {
      first_name: 'Pierre',
      last_name: 'Martin',
      email: 'pierre.martin@digitalagency.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.SALARIE,
      is_admin: false,
      client_id: clients[1]?.id, // Digital Agency Pro
    },
    {
      first_name: 'Sophie',
      last_name: 'Bernard',
      email: 'sophie.bernard@startupinnov.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.FREELANCE,
      is_admin: false,
      client_id: clients[2]?.id, // Startup Innov
    },
    {
      first_name: 'Lucas',
      last_name: 'Petit',
      email: 'lucas.petit@ecommerceplus.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.SALARIE,
      is_admin: false,
      client_id: clients[3]?.id, // E-commerce Plus
    },
    {
      first_name: 'Emma',
      last_name: 'Roux',
      email: 'emma.roux@greenenergy.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.CLIENT,
      is_admin: false,
      client_id: clients[4]?.id, // Green Energy Co
    },
    {
      first_name: 'Alexandre',
      last_name: 'Moreau',
      email: 'alexandre.moreau@techcorp.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.SALARIE,
      is_admin: false,
      client_id: clients[0]?.id, // TechCorp Solutions
    },
    {
      first_name: 'Julie',
      last_name: 'Leroy',
      email: 'julie.leroy@digitalagency.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.FREELANCE,
      is_admin: false,
      client_id: clients[1]?.id, // Digital Agency Pro
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
