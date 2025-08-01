import { DataSource } from 'typeorm';
import { Project, ProjectStatus } from '../../projects/entities/project.entity';
import { Client } from '../../clients/entities/client.entity';

export async function seedProjects(dataSource: DataSource) {
  const projectRepository = dataSource.getRepository(Project);
  const clientRepository = dataSource.getRepository(Client);

  // Récupérer les clients pour les assigner aux projets
  const clients = await clientRepository.find();

  const projects = [
    {
      name: 'Refonte Site Web E-commerce',
      description: 'Modernisation complète du site e-commerce avec nouvelle interface utilisateur et optimisation des performances',
      status: ProjectStatus.IN_PROGRESS,
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-03-31'),
      sold_hours: 120,
      spent_hours: 45,
      client_id: clients[3]?.id, // E-commerce Plus
    },
    {
      name: 'Application Mobile Fintech',
      description: 'Développement d\'une application mobile pour la gestion de finances personnelles',
      status: ProjectStatus.IN_PROGRESS,
      start_date: new Date('2025-01-15'),
      end_date: new Date('2025-05-15'),
      sold_hours: 200,
      spent_hours: 80,
      client_id: clients[2]?.id, // Startup Innov
    },
    {
      name: 'Plateforme de Monitoring Énergétique',
      description: 'Système de monitoring en temps réel pour les installations d\'énergies renouvelables',
      status: ProjectStatus.COMPLETED,
      start_date: new Date('2024-10-01'),
      end_date: new Date('2024-12-31'),
      sold_hours: 150,
      spent_hours: 150,
      client_id: clients[4]?.id, // Green Energy Co
    },
    {
      name: 'API REST pour Système CRM',
      description: 'Développement d\'une API REST complète pour un système de gestion de la relation client',
      status: ProjectStatus.IN_PROGRESS,
      start_date: new Date('2025-02-01'),
      end_date: new Date('2025-04-30'),
      sold_hours: 80,
      spent_hours: 25,
      client_id: clients[0]?.id, // TechCorp Solutions
    },
    {
      name: 'Campagne Marketing Digital',
      description: 'Création et gestion d\'une campagne marketing digitale complète avec analytics',
      status: ProjectStatus.COMPLETED,
      start_date: new Date('2024-11-01'),
      end_date: new Date('2024-12-15'),
      sold_hours: 60,
      spent_hours: 60,
      client_id: clients[1]?.id, // Digital Agency Pro
    },
    {
      name: 'Dashboard Analytics Avancé',
      description: 'Développement d\'un dashboard d\'analytics avec visualisations de données en temps réel',
      status: ProjectStatus.IN_PROGRESS,
      start_date: new Date('2025-01-20'),
      end_date: new Date('2025-06-20'),
      sold_hours: 180,
      spent_hours: 60,
      client_id: clients[0]?.id, // TechCorp Solutions
    },
    {
      name: 'Site Vitrine Responsive',
      description: 'Création d\'un site vitrine moderne et responsive pour présenter les services',
      status: ProjectStatus.COMPLETED,
      start_date: new Date('2024-09-01'),
      end_date: new Date('2024-10-31'),
      sold_hours: 40,
      spent_hours: 40,
      client_id: clients[1]?.id, // Digital Agency Pro
    },
  ];

  for (const project of projects) {
    const existingProject = await projectRepository.findOne({
      where: { name: project.name },
    });
    if (!existingProject) {
      await projectRepository.save(project);
    }
  }
} 