import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ProjectEntity } from '../entities/project.entity';

@Controller('projects')
export class ProjectController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getProjects(): Promise<ProjectEntity[]> {
    return this.appService.getProjects();
  }
}

@Controller('/')
export class HelloController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
