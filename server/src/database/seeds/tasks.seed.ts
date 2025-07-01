// import { DataSource } from 'typeorm';
// // import {
// //   Task,
// //   TaskStatus,
// //   TaskPriority,
// // } from '../../tasks/entities/task.entity';
// import { User } from '../../users/entities/user.entity';

// export async function seedTasks(dataSource: DataSource): Promise<void> {
//   // const taskRepository = dataSource.getRepository(Task);
//   const userRepository = dataSource.getRepository(User);

//   // Vérifier si des tâches existent déjà
//   // const existingTasks = await taskRepository.count();
//   // if (existingTasks > 0) {
//   //   console.log('Tasks already exist, skipping seed...');
//   //   return;
//   // }

//   // Récupérer un utilisateur pour les tests
//   const users = await userRepository.find();
//   if (users.length === 0) {
//     console.log('No users found, skipping task seed...');
//     return;
//   }

//   const testUser = users[0];

//   // Créer quelques tâches de test
//   const sampleTasks = [
//     {
//       title: "Développer l'API des tâches",
//       description: 'Créer les endpoints pour gérer les tâches',
//       status: 'IN_PROGRESS',
//       priority: 'HIGH',
//       estimated_hours: 8,
//       actual_hours: 3,
//       created_by_id: testUser.id,
//     },
//     {
//       title: "Créer l'interface utilisateur",
//       description: "Développer les composants Vue.js pour l'interface",
//       status: TaskStatus.PENDING,
//       priority: TaskPriority.MEDIUM,
//       estimated_hours: 6,
//       actual_hours: 0,
//       created_by_id: testUser.id,
//     },
//     {
//       title: "Tester l'application",
//       description: 'Effectuer les tests fonctionnels et unitaires',
//       status: TaskStatus.PENDING,
//       priority: TaskPriority.LOW,
//       estimated_hours: 4,
//       actual_hours: 0,
//       created_by_id: testUser.id,
//     },
//   ];

//   // Sauvegarder les tâches
//   // for (const taskData of sampleTasks) {
//   //   const task = taskRepository.create(taskData);
//   //   await taskRepository.save(task);
//   // }

//   //  console.log(`${sampleTasks.length} tâches de test créées avec succès`);
// }
