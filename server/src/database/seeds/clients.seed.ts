import { DataSource } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

export async function seedClients(dataSource: DataSource) {
  const clientRepository = dataSource.getRepository(Client);

  const clients = [
    {
      name: 'TechCorp Solutions',
      description: 'Entreprise spécialisée dans le développement de solutions technologiques innovantes',
      logo: 'https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=TC',
      website_prod: 'https://techcorp-solutions.com',
      website_preprod: 'https://preprod.techcorp-solutions.com',
    },
    {
      name: 'Digital Agency Pro',
      description: 'Agence digitale créative spécialisée dans le design et le marketing digital',
      logo: 'https://via.placeholder.com/150x150/50C878/FFFFFF?text=DA',
      website_prod: 'https://digitalagencypro.com',
      website_preprod: 'https://staging.digitalagencypro.com',
    },
    {
      name: 'Startup Innov',
      description: 'Startup en pleine croissance dans le secteur de la fintech',
      logo: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=SI',
      website_prod: 'https://startupinnov.com',
      website_preprod: 'https://dev.startupinnov.com',
    },
    {
      name: 'E-commerce Plus',
      description: 'Plateforme e-commerce spécialisée dans la vente en ligne',
      logo: 'https://via.placeholder.com/150x150/9B59B6/FFFFFF?text=EP',
      website_prod: 'https://ecommerceplus.com',
      website_preprod: 'https://test.ecommerceplus.com',
    },
    {
      name: 'Green Energy Co',
      description: 'Entreprise spécialisée dans les énergies renouvelables',
      logo: 'https://via.placeholder.com/150x150/27AE60/FFFFFF?text=GE',
      website_prod: 'https://greenenergyco.com',
      website_preprod: 'https://demo.greenenergyco.com',
    },
  ];

  for (const client of clients) {
    const existingClient = await clientRepository.findOne({
      where: { name: client.name },
    });
    if (!existingClient) {
      await clientRepository.save(client);
    }
  }
} 