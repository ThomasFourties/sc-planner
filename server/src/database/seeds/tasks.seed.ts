import { DataSource } from 'typeorm';
import {
  Task,
  TaskStatus,
  TaskPriority,
} from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

export async function seedTasks(dataSource: DataSource): Promise<void> {
  const taskRepository = dataSource.getRepository(Task);
  const userRepository = dataSource.getRepository(User);
  const projectRepository = dataSource.getRepository(Project);

  // Vérifier si des tâches existent déjà
  const existingTasks = await taskRepository.count();
  if (existingTasks > 0) {
    console.log('Tasks already exist, skipping seed...');
    return;
  }

  // Récupérer les utilisateurs et projets
  const users = await userRepository.find();
  const projects = await projectRepository.find();

  if (users.length === 0 || projects.length === 0) {
    console.log('No users or projects found, skipping task seed...');
    return;
  }

  // Créer des tâches réalistes liées aux projets
  const sampleTasks = [
    // Projet: Refonte Site Web E-commerce
    {
      name: 'Analyse des besoins utilisateurs',
      description: 'Conduire des entretiens et analyser les besoins des utilisateurs finaux',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      duration: 8,
      created_by_id: users[0].id, // Thomas Fourties
      assigned_to_id: users[1].id, // Marie Dubois
      project_id: projects[0].id,
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-01-02'),
    },
    {
      name: 'Design de l\'interface utilisateur',
      description: 'Créer les maquettes et prototypes de l\'interface utilisateur',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      duration: 16,
      created_by_id: users[1].id,
      assigned_to_id: users[2].id, // Pierre Martin
      project_id: projects[0].id,
      start_date: new Date('2025-01-03'),
      end_date: new Date('2025-01-10'),
    },
    {
      name: 'Développement frontend React',
      description: 'Implémenter les composants React pour l\'interface utilisateur',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      duration: 40,
      created_by_id: users[1].id,
      assigned_to_id: users[2].id,
      project_id: projects[0].id,
      start_date: new Date('2025-01-15'),
      end_date: new Date('2025-02-15'),
    },

    // Projet: Application Mobile Fintech
    {
      name: 'Architecture technique',
      description: 'Définir l\'architecture technique de l\'application mobile',
      status: TaskStatus.VALIDATED,
      priority: TaskPriority.HIGH,
      duration: 12,
      created_by_id: users[0].id,
      assigned_to_id: users[3].id, // Sophie Bernard
      project_id: projects[1].id,
      start_date: new Date('2025-01-15'),
      end_date: new Date('2025-01-20'),
    },
    {
      name: 'Développement API backend',
      description: 'Créer les endpoints API pour l\'application mobile',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      duration: 60,
      created_by_id: users[3].id,
      assigned_to_id: users[3].id,
      project_id: projects[1].id,
      start_date: new Date('2025-01-25'),
      end_date: new Date('2025-03-25'),
    },
    {
      name: 'Tests unitaires',
      description: 'Écrire et exécuter les tests unitaires pour l\'API',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      duration: 20,
      created_by_id: users[3].id,
      assigned_to_id: users[6].id, // Alexandre Moreau
      project_id: projects[1].id,
      start_date: new Date('2025-03-26'),
      end_date: new Date('2025-04-05'),
    },

    // Projet: API REST pour Système CRM
    {
      name: 'Spécifications techniques',
      description: 'Rédiger les spécifications techniques détaillées de l\'API',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      duration: 6,
      created_by_id: users[0].id,
      assigned_to_id: users[6].id,
      project_id: projects[3].id,
      start_date: new Date('2025-02-01'),
      end_date: new Date('2025-02-03'),
    },
    {
      name: 'Développement endpoints utilisateurs',
      description: 'Implémenter les endpoints CRUD pour la gestion des utilisateurs',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      duration: 12,
      created_by_id: users[6].id,
      assigned_to_id: users[6].id,
      project_id: projects[3].id,
      start_date: new Date('2025-02-05'),
      end_date: new Date('2025-02-12'),
    },
    {
      name: 'Documentation API',
      description: 'Rédiger la documentation technique de l\'API avec Swagger',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      duration: 8,
      created_by_id: users[6].id,
      assigned_to_id: users[7].id, // Julie Leroy
      project_id: projects[3].id,
      start_date: new Date('2025-04-20'),
      end_date: new Date('2025-04-25'),
    },

    // Projet: Dashboard Analytics Avancé
    {
      name: 'Conception base de données',
      description: 'Concevoir le schéma de base de données pour les analytics',
      status: TaskStatus.TO_VALIDATE,
      priority: TaskPriority.HIGH,
      duration: 10,
      created_by_id: users[0].id,
      assigned_to_id: users[6].id,
      project_id: projects[5].id,
      start_date: new Date('2025-01-20'),
      end_date: new Date('2025-01-25'),
    },
    {
      name: 'Intégration sources de données',
      description: 'Intégrer les différentes sources de données dans le système',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      duration: 25,
      created_by_id: users[6].id,
      assigned_to_id: users[6].id,
      project_id: projects[5].id,
      start_date: new Date('2025-01-30'),
      end_date: new Date('2025-02-20'),
    },
    {
      name: 'Développement visualisations',
      description: 'Créer les graphiques et tableaux de bord interactifs',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      duration: 35,
      created_by_id: users[6].id,
      assigned_to_id: users[7].id,
      project_id: projects[5].id,
      start_date: new Date('2025-03-01'),
      end_date: new Date('2025-04-15'),
    },

    // Tâches générales (sans projet)
    {
      name: 'Réunion équipe hebdomadaire',
      description: 'Réunion de suivi hebdomadaire avec l\'équipe de développement',
      status: TaskStatus.DONE,
      priority: TaskPriority.LOW,
      duration: 1,
      created_by_id: users[0].id,
      assigned_to_id: users[0].id,
      project_id: undefined,
      start_date: new Date('2025-01-20'),
      end_date: new Date('2025-01-20'),
    },
    {
      name: 'Formation nouvelles technologies',
      description: 'Formation sur les nouvelles technologies utilisées dans les projets',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      duration: 4,
      created_by_id: users[0].id,
      assigned_to_id: users[2].id,
      project_id: undefined,
      start_date: new Date('2025-02-10'),
      end_date: new Date('2025-02-10'),
    },
  ];

  for (const taskData of sampleTasks) {
    const task = taskRepository.create(taskData);
    await taskRepository.save(task);
  }
}
