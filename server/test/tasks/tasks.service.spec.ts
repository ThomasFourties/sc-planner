import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from '../../src/tasks/tasks.service';
import { Task, TaskStatus, TaskPriority } from '../../src/tasks/entities/task.entity';
import { User } from '../../src/users/entities/user.entity';
import { Project, ProjectStatus } from '../../src/projects/entities/project.entity';
import { UserRole } from '../../src/users/enums/user-role.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const mockTasksRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUsersRepository = {
    findOne: jest.fn(),
  };

  const mockUser: User = {
    id: 'user-1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@test.com',
    password: 'hashed_password',
    role: UserRole.CLIENT,
    is_admin: false,
    client_id: 'client-1',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    client: {} as any, // Mock client
  };

  const mockCreatedBy: User = {
    id: 'creator-1',
    first_name: 'Jane',
    last_name: 'Creator',
    email: 'jane@test.com',
    password: 'hashed_password',
    role: UserRole.CHEF_DE_PROJET,
    is_admin: true,
    client_id: undefined,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    client: undefined,
  };

  const mockProject: Project = {
    id: 'project-1',
    name: 'Test Project',
    description: 'A test project',
    status: ProjectStatus.IN_PROGRESS,
    start_date: new Date('2023-01-01'),
    end_date: new Date('2023-06-01'),
    sold_hours: 100,
    spent_hours: 80,
    client_id: 'client-1',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    client: {} as any, // Mock client
    tasks: [], // OneToMany - peut être vide
  };

  const mockTask: Task = {
    id: 'task-1',
    name: 'Test Task',
    description: 'A test task',
    duration: 5.5,
    assigned_to_id: 'user-1',
    created_by_id: 'creator-1',
    project_id: 'project-1',
    start_date: new Date('2023-01-01'),
    end_date: new Date('2023-01-02'),
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dependency_id: undefined,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    assigned_to: mockUser, // Relation optionnelle
    created_by: mockCreatedBy, // Relation obligatoire
    project: mockProject, // Relation optionnelle
    dependency: undefined, // Relation optionnelle
    completed: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = {
        name: 'New Task',
        description: 'New task description',
        duration: 3.5,
        project_id: 'project-1',
      };

      const savedTask = { ...mockTask, ...createTaskDto };
      mockTasksRepository.create.mockReturnValue(savedTask);
      mockTasksRepository.save.mockResolvedValue(savedTask);

      const result = await service.create(createTaskDto, 'creator-1');

      expect(mockTasksRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        created_by_id: 'creator-1',
      });
      expect(mockTasksRepository.save).toHaveBeenCalledWith(savedTask);
      expect(result).toEqual(savedTask);
    });

    it('should throw BadRequestException when task name is empty', async () => {
      const createTaskDto = {
        name: '',
        description: 'Task without name',
      };

      await expect(service.create(createTaskDto, 'creator-1')).rejects.toThrow(BadRequestException);
      await expect(service.create(createTaskDto, 'creator-1')).rejects.toThrow('Le nom de la tâche est requis');

      expect(mockTasksRepository.create).not.toHaveBeenCalled();
      expect(mockTasksRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto = {
        name: 'Updated Task',
        description: 'Updated description',
        status: TaskStatus.IN_PROGRESS,
      };

      const updatedTask = { ...mockTask, ...updateTaskDto };
      mockTasksRepository.update.mockResolvedValue({ affected: 1 });
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedTask);

      const result = await service.update(mockTask.id, updateTaskDto);

      expect(mockTasksRepository.update).toHaveBeenCalledWith(mockTask.id, updateTaskDto);
      expect(service.findOne).toHaveBeenCalledWith(mockTask.id);
      expect(result).toEqual(updatedTask);
    });

    it('should throw BadRequestException when task name is empty in update', async () => {
      const updateTaskDto = {
        name: '',
        description: 'Updated but no name',
      };

      // Mock findOne to return an existing task first
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask);

      await expect(service.update(mockTask.id, updateTaskDto)).rejects.toThrow(BadRequestException);
      await expect(service.update(mockTask.id, updateTaskDto)).rejects.toThrow('Le nom de la tâche ne peut pas être vide');

      expect(mockTasksRepository.update).not.toHaveBeenCalled();
    });
  });

  //   describe('assignTask', () => {
  // Nous devons ajouter cette méthode au service
  // it('should assign task to user successfully', async () => {
  //   // Ce test nécessite d'ajouter la méthode assignTask au service
  //   const assignTaskDto = { assigned_to_id: 'user-1' };

  //   mockTasksRepository.findOne.mockResolvedValue(mockTask);
  //   mockUsersRepository.findOne.mockResolvedValue(mockUser);
  //   mockTasksRepository.update.mockResolvedValue({ affected: 1 });

  //   const updatedTask = { ...mockTask, assigned_to_id: 'user-1' };
  //   jest.spyOn(service, 'findOne').mockResolvedValue(updatedTask);

  //   // Assuming we add this method to the service
  //   const result = await service.update(mockTask.id, assignTaskDto);

  //   expect(result.assigned_to_id).toBe('user-1');
  // });

  // it('should throw NotFoundException when task does not exist for assignment', async () => {
  //   mockTasksRepository.findOne.mockResolvedValue(null);

  //   await expect(service.findOne('nonexistent-task-id')).rejects.toThrow(
  //     NotFoundException,
  //   );
  // });

  // it('should throw NotFoundException when user does not exist for assignment', async () => {
  //   mockUsersRepository.findOne.mockResolvedValue(null);

  //   // This would be handled by a dedicated assignTask method
  //   // For now, we can test via update with validation
  // });
  // });

  describe('remove', () => {
    it('should remove task successfully', async () => {
      mockTasksRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockTask.id);

      expect(mockTasksRepository.delete).toHaveBeenCalledWith(mockTask.id);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTasksRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
      await expect(service.remove('nonexistent-id')).rejects.toThrow(`Tâche avec l'ID nonexistent-id non trouvée`);
    });
  });

  describe('findByUser', () => {
    it('should return tasks for specific user', async () => {
      const userTasks = [mockTask];
      mockTasksRepository.find.mockResolvedValue(userTasks);

      const result = await service.findByUser('user-1');

      expect(mockTasksRepository.find).toHaveBeenCalledWith({
        where: [{ assigned_to_id: 'user-1' }, { created_by_id: 'user-1' }],
        relations: ['assigned_to', 'created_by', 'project', 'project.client'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(userTasks);
    });

    it('should return empty array when user has no tasks', async () => {
      mockTasksRepository.find.mockResolvedValue([]);

      const result = await service.findByUser('user-without-tasks');

      expect(result).toEqual([]);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const allTasks = [mockTask, { ...mockTask, id: 'task-2', name: 'Task 2' }];
      mockTasksRepository.find.mockResolvedValue(allTasks);

      const result = await service.findAll();

      expect(mockTasksRepository.find).toHaveBeenCalledWith({
        relations: ['assigned_to', 'created_by', 'project', 'project.client'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(allTasks);
    });

    it('should return empty array when no tasks exist', async () => {
      mockTasksRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return task when found', async () => {
      mockTasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await service.findById(mockTask.id);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findOne', () => {
    it('should return task when found', async () => {
      mockTasksRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(mockTask.id);

      expect(mockTasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        relations: ['assigned_to', 'created_by', 'dependency'],
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockTasksRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(`Tâche avec l'ID nonexistent-id non trouvée`);
    });
  });
});
