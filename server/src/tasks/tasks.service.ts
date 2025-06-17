import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const taskData = {
      ...createTaskDto,
      created_by_id: userId,
      start_date: createTaskDto.start_date 
        ? new Date(createTaskDto.start_date) 
        : undefined,
      end_date: createTaskDto.end_date 
        ? new Date(createTaskDto.end_date) 
        : undefined,
    };

    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['assigned_to', 'created_by', 'dependency'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assigned_to', 'created_by', 'dependency'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async findByUser(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: [
        { assigned_to_id: userId },
        { created_by_id: userId },
      ],
      relations: ['assigned_to', 'created_by', 'dependency'],
      order: { created_at: 'DESC' },
    });
  }

  async findAssignedTo(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { assigned_to_id: userId },
      relations: ['assigned_to', 'created_by', 'dependency'],
      order: { created_at: 'DESC' },
    });
  }

  async findCreatedBy(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { created_by_id: userId },
      relations: ['assigned_to', 'created_by', 'dependency'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    const updatedTask = {
      ...updateTaskDto,
      start_date: updateTaskDto.start_date ? new Date(updateTaskDto.start_date) : task.start_date,
      end_date: updateTaskDto.end_date ? new Date(updateTaskDto.end_date) : task.end_date,
    };

    await this.taskRepository.update(id, updatedTask);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  async findDependentTasks(taskId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { dependency_id: taskId },
      relations: ['assigned_to', 'created_by', 'dependency'],
      order: { created_at: 'DESC' },
    });
  }
} 