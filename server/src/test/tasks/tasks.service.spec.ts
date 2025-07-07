import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from '../../tasks/tasks.service';
import { Task, TaskStatus, TaskPriority } from '../../tasks/entities/task.entity';
import { CreateTaskDto } from '../../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../../tasks/dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
  };

  const mockAssignedUser = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
  };

  const mockTask: Task = {
    id: '660e8400-e29b-41d4-a716-446655440000',
    name: 'Test Task',
    description: 'Test description',
    duration: 5,
    assigned_to_id: mockAssignedUser.id,
    created_by_id: mockUser.id,
    start_date: new Date('2023-01-01'),
    end_date: new Date('2023-01-05'),
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dependency_id: null,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    assigned_to: mockAssignedUser,
    created_by: mockUser,
    dependency: null,
  };

  const mockTaskWithDependency: Task = {
    ...mockTask,
    id: '660e8400-e29b-41d4-a716-446655440001',
    name: 'Dependent Task',
    dependency_id: mockTask.id,
    dependency: mockTask,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        name: 'New Task',
        description: 'New description',
        duration: 3,
        assigned_to_id: mockAssignedUser.id,
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
      };

      const expectedTaskData = {
        ...createTaskDto,
        created_by_id: mockUser.id,
      };

      mockRepository.create.mockReturnValue(expectedTaskData);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, mockUser.id);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedTaskData);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedTaskData);
      expect(result).toEqual(mockTask);
    });

    it('should create a task with minimal data', async () => {
      const minimalTaskDto: CreateTaskDto = {
        name: 'Minimal Task',
      };

      const expectedTaskData = {
        ...minimalTaskDto,
        created_by_id: mockUser.id,
      };

      mockRepository.create.mockReturnValue(expectedTaskData);
      mockRepository.save.mockResolvedValue({ ...mockTask, ...minimalTaskDto });

      const result = await service.create(minimalTaskDto, mockUser.id);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedTaskData);
      expect(result).toBeDefined();
    });

    it('should create a task with dependency', async () => {
      const taskWithDependencyDto: CreateTaskDto = {
        name: 'Task with dependency',
        dependency_id: mockTask.id,
      };

      const expectedTaskData = {
        ...taskWithDependencyDto,
        created_by_id: mockUser.id,
      };

      mockRepository.create.mockReturnValue(expectedTaskData);
      mockRepository.save.mockResolvedValue(mockTaskWithDependency);

      const result = await service.create(taskWithDependencyDto, mockUser.id);

      expect(mockRepository.create).toHaveBeenCalledWith(expectedTaskData);
      expect(result).toEqual(mockTaskWithDependency);
    });

    it('should create tasks with different statuses and priorities', async () => {
      const testCases = [
        { status: TaskStatus.IN_PROGRESS, priority: TaskPriority.LOW },
        { status: TaskStatus.DONE, priority: TaskPriority.HIGH },
        { status: TaskStatus.BLOCKED, priority: TaskPriority.MEDIUM },
      ];

      for (const testCase of testCases) {
        const createTaskDto: CreateTaskDto = {
          name: `Task ${testCase.status}`,
          status: testCase.status,
          priority: testCase.priority,
        };

        const expectedTaskData = {
          ...createTaskDto,
          created_by_id: mockUser.id,
        };

        const taskWithStatus = { ...mockTask, ...testCase };

        mockRepository.create.mockReturnValue(expectedTaskData);
        mockRepository.save.mockResolvedValue(taskWithStatus);

        const result = await service.create(createTaskDto, mockUser.id);

        expect(result.status).toBe(testCase.status);
        expect(result.priority).toBe(testCase.priority);
        jest.clearAllMocks();
      }
    });
  });

  describe('findAll', () => {
    it('should return all tasks with relations', async () => {
      const tasks = [mockTask, mockTaskWithDependency];
      mockRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['assigned_to', 'created_by'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(tasks);
    });

    it('should return an empty array when no tasks exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a task with all relations when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockTaskWithDependency);

      const result = await service.findOne(mockTaskWithDependency.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTaskWithDependency.id },
        relations: ['assigned_to', 'created_by', 'dependency'],
      });
      expect(result).toEqual(mockTaskWithDependency);
    });

    it('should throw NotFoundException when task not found', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        `Tâche avec l'ID ${nonExistentId} non trouvée`,
      );
    });
  });

  describe('findByUser', () => {
    it('should return tasks assigned to a specific user', async () => {
      const userTasks = [mockTask];
      mockRepository.find.mockResolvedValue(userTasks);

      const result = await service.findByUser(mockAssignedUser.id);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { assigned_to_id: mockAssignedUser.id },
        relations: ['assigned_to', 'created_by'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(userTasks);
    });

    it('should return an empty array when user has no tasks', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByUser('user-with-no-tasks');

      expect(result).toEqual([]);
    });

    it('should return multiple tasks for a user', async () => {
      const multipleTasks = [mockTask, { ...mockTask, id: 'task-2', name: 'Task 2' }];
      mockRepository.find.mockResolvedValue(multipleTasks);

      const result = await service.findByUser(mockAssignedUser.id);

      expect(result).toHaveLength(2);
      expect(result).toEqual(multipleTasks);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        name: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      };

      const updatedTask = { ...mockTask, ...updateTaskDto };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      // Mock findOne call from update method
      mockRepository.findOne.mockResolvedValue(updatedTask);

      const result = await service.update(mockTask.id, updateTaskDto);

      expect(mockRepository.update).toHaveBeenCalledWith(mockTask.id, updateTaskDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        relations: ['assigned_to', 'created_by', 'dependency'],
      });
      expect(result).toEqual(updatedTask);
    });

    it('should update partial task data', async () => {
      const partialUpdateDto: UpdateTaskDto = {
        status: TaskStatus.DONE,
      };

      const updatedTask = { ...mockTask, status: TaskStatus.DONE };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedTask);

      const result = await service.update(mockTask.id, partialUpdateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(mockTask.id, partialUpdateDto);
      expect(result.status).toBe(TaskStatus.DONE);
    });

    it('should throw NotFoundException when updating non-existent task', async () => {
      const updateTaskDto: UpdateTaskDto = { name: 'Updated Task' };
      const nonExistentId = 'non-existent-id';

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(nonExistentId, updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(nonExistentId, updateTaskDto)).rejects.toThrow(
        `Tâche avec l'ID ${nonExistentId} non trouvée`,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockTask.id);

      expect(mockRepository.delete).toHaveBeenCalledWith(mockTask.id);
    });

    it('should throw NotFoundException when removing non-existent task', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove(nonExistentId)).rejects.toThrow(
        `Tâche avec l'ID ${nonExistentId} non trouvée`,
      );
    });

    it('should handle multiple task deletions', async () => {
      const taskIds = ['task-1', 'task-2', 'task-3'];

      for (const taskId of taskIds) {
        mockRepository.delete.mockResolvedValue({ affected: 1 });
        
        await service.remove(taskId);
        
        expect(mockRepository.delete).toHaveBeenCalledWith(taskId);
        jest.clearAllMocks();
      }
    });
  });
}); 