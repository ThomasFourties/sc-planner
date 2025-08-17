import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, created_by_id: string): Promise<Task> {
    if (!createTaskDto.name) {
      throw new BadRequestException('Le nom de la tâche est requis');
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      created_by_id,
    });

    return await this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find({
      relations: ['assigned_to', 'created_by', 'project', 'project.client'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    try {
      const task = await this.tasksRepository.findOne({
        where: { id },
        relations: ['assigned_to', 'created_by', 'dependency'],
      });

      if (!task) {
        throw new NotFoundException(`Tâche avec l'ID ${id} non trouvée`);
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Si l'erreur est liée à un UUID invalide
      if (error.message.includes('invalid input syntax for type uuid')) {
        throw new NotFoundException(`Tâche avec l'ID ${id} non trouvée`);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Task | null> {
    return await this.tasksRepository.findOne({
      where: { id },
      relations: ['assigned_to', 'created_by', 'dependency'],
    });
  }

  async findByUser(userId: string): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: [{ assigned_to_id: userId }, { created_by_id: userId }],
      relations: ['assigned_to', 'created_by', 'project', 'project.client'],
      order: { created_at: 'DESC' },
    });
  }

  async findByProject(projectId: string): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { project_id: projectId },
      relations: ['assigned_to', 'created_by', 'project'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      // Vérifier que la tâche existe avant la mise à jour
      await this.findOne(id);

      // Si un nom est fourni, il ne doit pas être vide
      if (updateTaskDto.name !== undefined && !updateTaskDto.name.trim()) {
        throw new BadRequestException('Le nom de la tâche ne peut pas être vide');
      }

      await this.tasksRepository.update(id, updateTaskDto);
      return await this.findOne(id);
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // Si l'erreur est liée à un UUID invalide
      if (error?.message?.includes('invalid input syntax for type uuid')) {
        throw new NotFoundException(`Tâche avec l'ID ${id} non trouvée`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.tasksRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Tâche avec l'ID ${id} non trouvée`);
      }
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Si l'erreur est liée à un UUID invalide
      if (error?.message?.includes('invalid input syntax for type uuid')) {
        throw new NotFoundException(`Tâche avec l'ID ${id} non trouvée`);
      }
      throw error;
    }
  }
}
