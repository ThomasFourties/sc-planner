import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle tâche' })
  @ApiResponse({
    status: 201,
    description: 'La tâche a été créée avec succès.',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req): Promise<Task> {
    console.log('User from request:', req.user);
    if (!req.user || !req.user.userId) {
      throw new Error('User not authenticated or user ID missing');
    }
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les tâches' })
  @ApiResponse({
    status: 200,
    description: 'Liste de toutes les tâches récupérée avec succès.',
    type: [Task],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get('my-tasks')
  @ApiOperation({ summary: "Récupérer les tâches de l'utilisateur connecté" })
  @ApiResponse({
    status: 200,
    description: 'Tâches de l\'utilisateur récupérées avec succès.',
    type: [Task],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  findMyTasks(@Request() req): Promise<Task[]> {
    return this.tasksService.findByUser(req.user.userId);
  }

  @Get('assigned-to-me')
  @ApiOperation({ summary: "Récupérer les tâches assignées à l'utilisateur connecté" })
  @ApiResponse({
    status: 200,
    description: 'Tâches assignées récupérées avec succès.',
    type: [Task],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  findAssignedToMe(@Request() req): Promise<Task[]> {
    return this.tasksService.findAssignedTo(req.user.userId);
  }

  @Get('created-by-me')
  @ApiOperation({ summary: "Récupérer les tâches créées par l'utilisateur connecté" })
  @ApiResponse({
    status: 200,
    description: 'Tâches créées récupérées avec succès.',
    type: [Task],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  findCreatedByMe(@Request() req): Promise<Task[]> {
    return this.tasksService.findCreatedBy(req.user.userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Récupérer les tâches d'un utilisateur spécifique" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Tâches de l\'utilisateur récupérées avec succès.',
    type: [Task],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  findByUser(@Param('userId') userId: string): Promise<Task[]> {
    return this.tasksService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une tâche par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  @ApiResponse({
    status: 200,
    description: 'Tâche récupérée avec succès.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Get(':id/dependents')
  @ApiOperation({ summary: 'Récupérer les tâches qui dépendent de cette tâche' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  @ApiResponse({
    status: 200,
    description: 'Tâches dépendantes récupérées avec succès.',
    type: [Task],
  })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  findDependentTasks(@Param('id') id: string): Promise<Task[]> {
    return this.tasksService.findDependentTasks(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une tâche' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  @ApiResponse({
    status: 200,
    description: 'Tâche mise à jour avec succès.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une tâche' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  @ApiResponse({
    status: 200,
    description: 'Tâche supprimée avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
} 