import { DataSource } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

export async function seedTasks(dataSource: DataSource): Promise<void> {
  const taskRepository = dataSource.getRepository(Task);
  const userRepository = dataSource.getRepository(User);

  // Récupérer des utilisateurs existants
  const users = await userRepository.find({ take: 2 });
  
  if (users.length < 2) {
    console.log('Pas assez d\'utilisateurs pour créer des tâches d\'exemple');
    return;
  }

  const [user1, user2] = users;

  // Vérifier si des tâches existent déjà
  const existingTasks = await taskRepository.count();
  if (existingTasks > 0) {
    console.log('Des tâches existent déjà, seed ignoré');
    return;
  }

  // Créer des tâches d'exemple
  const tasks = [
    {
      name: "Configurer l'environnement de développement",
      description: 'Installer Node.js, NestJS, et configurer la base de données',
      duration: 4,
      assigned_to_id: user1.id,
      created_by_id: user2.id,
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-01-01'),
    },
    {
      name: "Créer l'API d'authentification",
      description: 'Implémenter les endpoints de login, register et logout',
      duration: 8,
      assigned_to_id: user2.id,
      created_by_id: user1.id,
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      start_date: new Date('2024-01-02'),
      end_date: new Date('2024-01-03'),
    },
    {
      name: "Développer l'API des tâches",
      description: 'Créer les endpoints CRUD pour la gestion des tâches',
      duration: 12,
      assigned_to_id: user1.id,
      created_by_id: user2.id,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      start_date: new Date('2024-01-04'),
      end_date: new Date('2024-01-06'),
    },
    {
      name: "Créer l'interface utilisateur",
      description: "Développer les composants Vue.js pour l'interface",
      duration: 16,
      assigned_to_id: user2.id,
      created_by_id: user1.id,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      // dependency_id sera ajouté après la création
    },
    {
      name: 'Tests unitaires',
      description: 'Écrire les tests pour toutes les fonctionnalités',
      duration: 6,
      assigned_to_id: user1.id,
      created_by_id: user2.id,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    },
    {
      name: 'Documentation',
      description: 'Rédiger la documentation technique et utilisateur',
      duration: 4,
      assigned_to_id: user2.id,
      created_by_id: user1.id,
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
    },
  ];

  // Créer et sauvegarder les tâches
  const taskEntities = tasks.map(taskData => taskRepository.create(taskData));
  const savedTasks = await taskRepository.save(taskEntities);

  // Mettre à jour les dépendances
  // La tâche "Créer l'interface utilisateur" dépend de "Développer l'API des tâches"
  const apiTask = savedTasks.find(
    (task) => task.name === "Développer l'API des tâches",
  );
  const uiTask = savedTasks.find(
    (task) => task.name === "Créer l'interface utilisateur",
  );
  
  if (apiTask && uiTask) {
    uiTask.dependency_id = apiTask.id;
    await taskRepository.save(uiTask);
  }

  console.log(`${savedTasks.length} tâches d'exemple créées`);
} 