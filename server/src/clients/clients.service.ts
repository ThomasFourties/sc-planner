import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
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
    // Vérifier que le client existe
    const existingClient = await this.clientRepository.findOne({
      where: { id },
    });

    if (!existingClient) {
      throw new NotFoundException('Client non trouvé');
    }

    const result = await this.clientRepository.update(id, updateClientDto);

    if (result.affected === 0) {
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour du client',
      );
    }

    // Retourner le client mis à jour avec les mêmes données que findOne
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException('Client non trouvé');
    }

    const result = await this.clientRepository.delete(id);

    if (result.affected === 0) {
      throw new InternalServerErrorException(
        'Erreur lors de la suppression du client',
      );
    }

    return { message: 'Client supprimé avec succès' };
  }
}
