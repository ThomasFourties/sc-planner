import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    if (!createProjectDto.name || createProjectDto.name.trim() === '') {
      throw new BadRequestException('Le nom du projet est requis');
    }

    // Vérifier que le client existe
    const client = await this.clientsRepository.findOne({
      where: { id: createProjectDto.client_id },
    });

    if (!client) {
      throw new NotFoundException('Client non trouvé');
    }

    const project = this.projectsRepository.create(createProjectDto);
    return await this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectsRepository.find({
      relations: ['client', 'tasks'],
    });
  }

  async findByClient(clientId: string): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { client_id: clientId },
      relations: ['client', 'tasks'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client', 'tasks'],
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    return project;
  }

  async update(id: string, { name, client_id, ...rest }: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    if (!name?.trim()) {
      throw new BadRequestException('Le nom du projet est requis');
    }

    if (client_id) {
      const client = await this.clientsRepository.findOne({ where: { id: client_id } });
      if (!client) throw new NotFoundException('Client non trouvé');
    }

    Object.assign(project, { name, client_id, ...rest });
    return this.projectsRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }
}
