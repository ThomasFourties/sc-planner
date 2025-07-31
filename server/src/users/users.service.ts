import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['client'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['client'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['client'],
    });
  }



  async update(id: string, userData: Partial<User>): Promise<User> {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const result = await this.userRepository.update(id, userData);

    if (result.affected === 0) {
      throw new InternalServerErrorException('Erreur lors de la mise à jour');
    }

    return this.findById(id) as Promise<User>;
  }

  async delete(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.role === UserRole.CHEF_DE_PROJET) {
      throw new BadRequestException(
        'Impossible de supprimer un chef de projet',
      );
    }

    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new InternalServerErrorException('Erreur lors de la suppression');
    }

    return { message: 'Utilisateur supprimé avec succès' };
  }

  async getProfile(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }
}
