import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,

    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    if (!createClientDto.name) {
      throw new BadRequestException('Le nom du client est requis');
    }

    const { user_ids, ...clientData } = createClientDto;

    const client = this.clientRepository.create(clientData);
    const savedClient = await this.clientRepository.save(client);

    if (user_ids?.length) {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ client: savedClient })
        .where('id IN (:...user_ids)', { user_ids })
        .execute();
    }

    const result = await this.clientRepository.findOne({
      where: { id: savedClient.id },
      relations: ['users', 'projects'],
    });

    if (!result) {
      throw new NotFoundException('Client non trouvé');
    }

    return result;
  }

  async findAll(): Promise<any[]> {
    const clients = await this.clientRepository.find({
      relations: ['projects', 'users'],
    });

    return clients.map((client) => ({
      ...client,
      stats: {
        projectsCount: client.projects?.length || 0,
        totalSoldHours:
          client.projects?.reduce(
            (sum, project) => sum + Number(project.sold_hours || 0),
            0,
          ) || 0,
        totalSpentHours:
          client.projects?.reduce(
            (sum, project) => sum + Number(project.spent_hours || 0),
            0,
          ) || 0,
      },
    }));
  }

  async findOne(id: string): Promise<any> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['projects', 'users'],
    });

    if (!client) {
      throw new NotFoundException('Client non trouvé');
    }

    return {
      ...client,
      stats: {
        projectsCount: client.projects?.length || 0,
        totalSoldHours:
          client.projects?.reduce(
            (sum, project) => sum + Number(project.sold_hours || 0),
            0,
          ) || 0,
        totalSpentHours:
          client.projects?.reduce(
            (sum, project) => sum + Number(project.spent_hours || 0),
            0,
          ) || 0,
      },
    };
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<any> {
    const { user_ids, ...updateData } = updateClientDto;

    if (!updateClientDto.name) {
      throw new BadRequestException('Le nom du client est requis');
    }

    const existingClient = await this.clientRepository.findOne({
      where: { id },
    });

    if (!existingClient) {
      throw new NotFoundException('Client non trouvé');
    }

    await this.clientRepository.update(id, updateData);

    if (user_ids !== undefined) {
      try {
        await this.userRepository.manager.query(
          'UPDATE users SET client_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE client_id = $1',
          [id],
        );

        if (user_ids.length > 0) {
          await this.userRepository
            .createQueryBuilder()
            .update(User)
            .set({ client_id: id })
            .where('id IN (:...user_ids)', { user_ids })
            .execute();
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour des utilisateurs:', error);
        throw error;
      }
    }

    const updatedClient = await this.findOne(id);
    return updatedClient;
  }

  async remove(id: string): Promise<void> {
    return await this.clientRepository.manager.transaction(async (manager) => {
      const clientRepo = manager.getRepository(Client);
      const userRepo = manager.getRepository(User);
      const projectRepo = manager.getRepository(Project);
      const taskRepo = manager.getRepository(Task);

      const client = await clientRepo.findOne({
        where: { id },
        relations: ['projects', 'users'],
      });

      if (!client) throw new NotFoundException('Client non trouvé');

      try {
        // ✅ CORRECTION ICI
        await userRepo
          .createQueryBuilder()
          .update(User)
          .set({ client_id: () => 'NULL' })
          .where('client_id = :id', { id })
          .execute();

        if (client.projects?.length) {
          for (const project of client.projects) {
            await taskRepo.delete({
              project_id: project.id,
            });
          }

          await projectRepo.delete({
            client_id: id,
          });
        }

        await clientRepo.delete({ id });
      } catch (error: any) {
        console.error('Erreur lors de la suppression du client:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Erreur inconnue';
        throw new InternalServerErrorException(
          `Impossible de supprimer le client: ${errorMessage}`,
        );
      }
    });
  }
}
