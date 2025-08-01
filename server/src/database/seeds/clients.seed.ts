import { DataSource } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

export async function seedClients(dataSource: DataSource) {
  const clientRepository = dataSource.getRepository(Client);

  const clients = [
    {
      name: 'TechCorp Solutions',
      description: 'Entreprise spécialisée dans le développement de solutions technologiques innovantes',
      logo: 'https://picsum.photos/400/400',
      website_prod: 'https://techcorp-solutions.com',
      website_preprod: 'https://preprod.techcorp-solutions.com',
    },
    {
      name: 'Digital Agency Pro',
      description: 'Agence digitale créative spécialisée dans le design et le marketing digital',
      logo: 'https://picsum.photos/400/401',
      website_prod: 'https://digitalagencypro.com',
      website_preprod: 'https://staging.digitalagencypro.com',
    },
    {
      name: 'Startup Innov',
      description: 'Startup en pleine croissance dans le secteur de la fintech',
      logo: 'https://picsum.photos/400/402',
      website_prod: 'https://startupinnov.com',
      website_preprod: 'https://dev.startupinnov.com',
    },
    {
      name: 'E-commerce Plus',
      description: 'Plateforme e-commerce spécialisée dans la vente en ligne',
      logo: 'https://picsum.photos/400/403',
      website_prod: 'https://ecommerceplus.com',
      website_preprod: 'https://test.ecommerceplus.com',
    },
    {
      name: 'Green Energy Co',
      description: 'Entreprise spécialisée dans les énergies renouvelables',
      logo: 'https://picsum.photos/400/404',
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