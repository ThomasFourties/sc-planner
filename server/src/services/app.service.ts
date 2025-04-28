import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '../entities/project.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  /////////////////
  /// PROJECTS ///
  ///////////////
  async getProjects(): Promise<ProjectEntity[]> {
    return this.projectRepository.find({});
  }

  getHello(): string {
    return 'Hello World!';
  }
}
