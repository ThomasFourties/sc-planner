// import { Injectable, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, DataSource } from 'typeorm';
// import { User } from '../users/entities/user.entity';
// // import { Task, TaskStatus, TaskPriority } from '../tasks/entities/task.entity';
// import { UserRole } from '../users/enums/user-role.enum';
// // import { EmailService } from '../email/email.service';

// export interface MetricsResponse {
//   status: 'healthy' | 'unhealthy';
//   timestamp: string;
//   uptime: number;
//   version: string;
//   environment: string;
//   database: {
//     status: 'connected' | 'disconnected';
//     latency: number;
//     connections: number;
//   };
//   users: {
//     total: number;
//     byRole: Record<UserRole, number>;
//     recentRegistrations: number;
//   };
//   tasks: {
//     total: number;
//     byStatus: Record<string, number>;
//     byPriority: Record<string, number>;
//     completionRate: number;
//   };
//   system: {
//     memory: {
//       used: number;
//       total: number;
//       percentage: number;
//     };
//     cpu: {
//       usage: number;
//     };
//   };
//   services: {
//     email: {
//       status: 'healthy' | 'unhealthy';
//       configured: boolean;
//     };
//     auth: {
//       status: 'healthy' | 'unhealthy';
//     };
//   };
// }

// @Injectable()
// export class HealthService {
//   private readonly logger = new Logger(HealthService.name);
//   private readonly startTime = Date.now();

//   constructor(
//     @InjectRepository(User)
//     private usersRepository: Repository<User>,
//     // @InjectRepository(Task)
//     // private tasksRepository: Repository<Task>,
//     private dataSource: DataSource,
//     // private emailService: EmailService,
//   ) {}

//   async getMetrics(): Promise<MetricsResponse> {
//     try {
//       const [
//         databaseMetrics,
//         userMetrics,
//         // taskMetrics,
//         systemMetrics,
//         serviceMetrics,
//       ] = await Promise.all([
//         this.getDatabaseMetrics(),
//         this.getUserMetrics(),
//         // this.getTaskMetrics(),
//         this.getSystemMetrics(),
//         this.getServiceMetrics(),
//       ]);

//       const overallStatus = this.determineOverallStatus(
//         databaseMetrics,
//         serviceMetrics,
//       );

//       return {
//         status: overallStatus,
//         timestamp: new Date().toISOString(),
//         uptime: Math.floor((Date.now() - this.startTime) / 1000),
//         version: process.env.npm_package_version || '0.4.0',
//         environment: process.env.NODE_ENV || 'development',
//         database: databaseMetrics,
//         users: userMetrics,
//         // tasks: taskMetrics,
//         system: systemMetrics,
//         services: serviceMetrics,
//       };
//     } catch (error) {
//       this.logger.error('Error collecting metrics:', error);
//       return this.getErrorMetrics();
//     }
//   }

//   private async getDatabaseMetrics() {
//     try {
//       const startTime = Date.now();

//       await this.dataSource.query('SELECT 1');
//       const latency = Date.now() - startTime;

//       const connectionQuery = await this.dataSource.query(`
//         SELECT count(*) as connections
//         FROM pg_stat_activity
//         WHERE state = 'active'
//       `);

//       return {
//         status: 'connected' as const,
//         latency,
//         connections: parseInt(
//           (connectionQuery[0] as { connections: string })?.connections || '0',
//         ),
//       };
//     } catch (error) {
//       this.logger.error('Database health check failed:', error);
//       return {
//         status: 'disconnected' as const,
//         latency: -1,
//         connections: 0,
//       };
//     }
//   }

//   private async getUserMetrics() {
//     try {
//       const total = await this.usersRepository.count();

//       const roleQuery = await this.usersRepository
//         .createQueryBuilder('user')
//         .select('user.role, COUNT(*) as count')
//         .groupBy('user.role')
//         .getRawMany();

//       const byRole = {} as Record<UserRole, number>;
//       Object.values(UserRole).forEach((role) => {
//         byRole[role] = 0;
//       });

//       roleQuery.forEach((row) => {
//         byRole[row.user_role as UserRole] = parseInt(row.count as string);
//       });

//       const yesterday = new Date();
//       yesterday.setDate(yesterday.getDate() - 1);

//       const recentRegistrations = await this.usersRepository
//         .createQueryBuilder('user')
//         .where('user.created_at >= :yesterday', { yesterday })
//         .getCount();

//       return {
//         total,
//         byRole,
//         recentRegistrations,
//       };
//     } catch (error) {
//       this.logger.error('Error getting user metrics:', error);
//       return {
//         total: 0,
//         byRole: {} as Record<UserRole, number>,
//         recentRegistrations: 0,
//       };
//     }
//   }

//   private async getTaskMetrics() {
//     try {
//       const total = await this.tasksRepository.count();

//       const statusQuery = await this.tasksRepository
//         .createQueryBuilder('task')
//         .select('task.status, COUNT(*) as count')
//         .groupBy('task.status')
//         .getRawMany();

//       const byStatus = {} as Record<string, number>;
//       Object.values(TaskStatus).forEach((status) => {
//         byStatus[status] = 0;
//       });

//       statusQuery.forEach((row) => {
//         byStatus[row.task_status as TaskStatus] = parseInt(row.count as string);
//       });

//       const priorityQuery = await this.tasksRepository
//         .createQueryBuilder('task')
//         .select('task.priority, COUNT(*) as count')
//         .groupBy('task.priority')
//         .getRawMany();

//       const byPriority = {} as Record<string, number>;
//       Object.values(TaskPriority).forEach((priority) => {
//         byPriority[priority] = 0;
//       });

//       priorityQuery.forEach((row) => {
//         byPriority[row.task_priority as string] = parseInt(
//           row.count as string,
//         );
//       });

//       const completedTasks = byStatus[TaskStatus.COMPLETED] || 0;
//       const completionRate = total > 0 ? (completedTasks / total) * 100 : 0;

//       return {
//         total,
//         byStatus,
//         byPriority,
//         completionRate: Math.round(completionRate * 100) / 100,
//       };
//     } catch (error) {
//       this.logger.error('Error getting task metrics:', error);
//       return {
//         total: 0,
//         byStatus: {} as Record<TaskStatus, number>,
//         byPriority: {} as Record<TaskPriority, number>,
//         completionRate: 0,
//       };
//     }
//   }

//   private getSystemMetrics() {
//     try {
//       const memoryUsage = process.memoryUsage();
//       const totalMemory = memoryUsage.heapTotal;
//       const usedMemory = memoryUsage.heapUsed;
//       const memoryPercentage = (usedMemory / totalMemory) * 100;

//       const cpuUsage = process.cpuUsage();
//       const cpuPercentage =
//         ((cpuUsage.user + cpuUsage.system) / 1000000 / process.uptime()) * 100;

//       return {
//         memory: {
//           used: Math.round((usedMemory / 1024 / 1024) * 100) / 100,
//           total: Math.round((totalMemory / 1024 / 1024) * 100) / 100,
//           percentage: Math.round(memoryPercentage * 100) / 100,
//         },
//         cpu: {
//           usage: Math.round(Math.min(cpuPercentage, 100) * 100) / 100,
//         },
//       };
//     } catch (error) {
//       this.logger.error('Error getting system metrics:', error);
//       return {
//         memory: { used: 0, total: 0, percentage: 0 },
//         cpu: { usage: 0 },
//       };
//     }
//   }

//   private async getServiceMetrics() {
//     try {
//       const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

//       let authStatus: 'healthy' | 'unhealthy' = 'healthy';
//       try {
//         if (!process.env.JWT_SECRET) {
//           authStatus = 'unhealthy';
//         }
//       } catch {
//         authStatus = 'unhealthy';
//       }

//       const emailStatus: 'healthy' | 'unhealthy' = emailConfigured
//         ? 'healthy'
//         : 'unhealthy';

//       return {
//         email: {
//           status: emailStatus,
//           configured: !!emailConfigured,
//         },
//         auth: {
//           status: authStatus,
//         },
//       };
//     } catch (error) {
//       this.logger.error('Error getting service metrics:', error);
//       return {
//         email: { status: 'unhealthy' as const, configured: false },
//         auth: { status: 'unhealthy' as const },
//       };
//     }
//   }

//   private determineOverallStatus(
//     databaseMetrics: any,
//     serviceMetrics: any,
//   ): 'healthy' | 'unhealthy' {
//     if (databaseMetrics.status === 'disconnected') {
//       return 'unhealthy';
//     }

//     if (serviceMetrics.auth.status === 'unhealthy') {
//       return 'unhealthy';
//     }

//     return 'healthy';
//   }

//   private getErrorMetrics(): MetricsResponse {
//     return {
//       status: 'unhealthy',
//       timestamp: new Date().toISOString(),
//       uptime: Math.floor((Date.now() - this.startTime) / 1000),
//       version: process.env.npm_package_version || '0.4.0',
//       environment: process.env.NODE_ENV || 'development',
//       database: { status: 'disconnected', latency: -1, connections: 0 },
//       users: {
//         total: 0,
//         byRole: {} as Record<UserRole, number>,
//         recentRegistrations: 0,
//       },
//       tasks: {
//         total: 0,
//         byStatus: {} as Record<TaskStatus, number>,
//         byPriority: {} as Record<TaskPriority, number>,
//         completionRate: 0,
//       },
//       system: {
//         memory: { used: 0, total: 0, percentage: 0 },
//         cpu: { usage: 0 },
//       },
//       services: {
//         email: { status: 'unhealthy', configured: false },
//         auth: { status: 'unhealthy' },
//       },
//     };
//   }

//   async basicHealthCheck() {
//     try {
//       await this.dataSource.query('SELECT 1');
//       return {
//         status: 'ok',
//         timestamp: new Date().toISOString(),
//         database: 'connected',
//       };
//     } catch (error) {
//       return {
//         status: 'error',
//         timestamp: new Date().toISOString(),
//         database: 'disconnected',
//         error: error.message,
//       };
//     }
//   }
// }
