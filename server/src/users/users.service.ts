import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/entities/task.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  private validateUUID(id: string, fieldName: string = 'ID'): void {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`${fieldName} "${id}" is not a valid UUID`);
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_admin: true,
        profile_img: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async create(userDTO: UserDTO): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: userDTO.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userDTO.password, 10);

    const user = this.usersRepository.create({
      ...userDTO,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    this.validateUUID(id, 'User ID');
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async remove(id: string): Promise<void> {
    this.validateUUID(id, 'User ID');
    const user = await this.findOne(id);

    await this.tasksRepository.update(
      { assigned_to_id: id },
      { assigned_to_id: undefined },
    );
    await this.tasksRepository.delete({ created_by_id: id });

    await this.usersRepository.remove(user);
  }
}
