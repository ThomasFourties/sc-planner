import { DataSource } from 'typeorm';
import {
  Task,
  TaskStatus,
  TaskPriority,
} from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

export async function seedTasks(dataSource: DataSource): Promise<void> {
  const taskRepository = dataSource.getRepository(Task);
  const userRepository = dataSource.getRepository(User);

  //   Vérifier si des tâches existent déjà
  const existingTasks = await taskRepository.count();
  if (existingTasks > 0) {
    console.log('Tasks already exist, skipping seed...');
    return;
  }

  // Récupérer un utilisateur pour les tests
  const users = await userRepository.find();
  if (users.length === 0) {
    console.log('No users found, skipping task seed...');
    return;
  }

  const createdBy = users[0];
  const assignedTo = users[1];

  // Créer quelques tâches de test
  const sampleTasks = [
    {
      name: "Développer l'API des tâches",
      description: 'Créer les endpoints pour gérer les tâches',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      duration: 8,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-01-15'),
      end_date: new Date('2025-01-17'),
    },
    {
      name: "Créer l'interface utilisateur",
      description: "Développer les composants Vue.js pour l'interface",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      duration: 6,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-01-18'),
      end_date: new Date('2025-01-20'),
    },
    {
      name: "Tester l'application",
      description: 'Effectuer les tests fonctionnels et unitaires',
      status: TaskStatus.TO_VALIDATE,
      priority: TaskPriority.LOW,
      duration: 4,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-01-22'),
      end_date: new Date('2025-01-23'),
    },
    {
      name: 'Révision du code',
      description: "Faire la révision du code avec l'équipe",
      status: TaskStatus.VALIDATED,
      priority: TaskPriority.MEDIUM,
      duration: 2,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-01-10'),
      end_date: new Date('2025-01-10'),
    },
    {
      name: 'Déploiement en production',
      description: "Déployer l'application sur le serveur de production",
      status: TaskStatus.WAITING_FOR_INFO,
      priority: TaskPriority.URGENT,
      duration: 3,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-01-25'),
      end_date: new Date('2025-01-25'),
    },
    {
      name: 'Configuration serveur',
      description: 'Configurer les serveurs de production',
      status: TaskStatus.PROCESSED_PREPROD,
      priority: TaskPriority.HIGH,
      duration: 5,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-01-12'),
      end_date: new Date('2025-01-14'),
    },
    {
      name: 'Documentation utilisateur',
      description: 'Rédiger la documentation pour les utilisateurs finaux',
      status: TaskStatus.PROCESSED_PROD,
      priority: TaskPriority.MEDIUM,
      duration: 4,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-01-28'),
      end_date: new Date('2025-01-30'),
    },
    {
      name: 'Migration base de données',
      description: 'Migrer les données vers la nouvelle structure',
      status: TaskStatus.CANCELLED,
      priority: TaskPriority.LOW,
      duration: 6,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-01-05'),
      end_date: new Date('2025-01-07'),
    },
    {
      name: 'Optimisation performances',
      description: "Optimiser les performances de l'application",
      status: TaskStatus.TO_TIMER,
      priority: TaskPriority.HIGH,
      duration: 8,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-02-01'),
      end_date: new Date('2025-02-03'),
    },
    {
      name: 'Formation équipe',
      description: "Former l'équipe sur les nouvelles fonctionnalités",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      duration: 3,
      created_by_id: createdBy.id,
      assigned_to_id: assignedTo?.id,
      start_date: new Date('2025-01-08'),
      end_date: new Date('2025-01-08'),
    },
  ];

  for (const taskData of sampleTasks) {
    const task = taskRepository.create(taskData);
    await taskRepository.save(task);
  }
}
