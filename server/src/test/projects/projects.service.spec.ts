import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsService } from '../../projects/projects.service';
import { Project, ProjectStatus } from '../../projects/entities/project.entity';
import { Client } from '../../clients/entities/client.entity';

import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockProjectsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockClientsRepository = {
    findOne: jest.fn(),
  };

  const mockClient: Client = {
    id: 'client-1',
    name: 'Test Client',
    description: 'A test client',
    logo: 'logo.png',
    website_prod: 'https://prod.test.com',
    website_preprod: 'https://preprod.test.com',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    users: [],
    projects: [],
  };

  const mockProject: Project = {
    id: 'project-1',
    name: 'Test Project',
    description: 'A test project',
    status: ProjectStatus.IN_PROGRESS,
    start_date: new Date('2023-01-01'),
    end_date: new Date('2023-06-01'),
    sold_hours: 100,
    spent_hours: 80,
    client_id: 'client-1',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    client: mockClient,
    tasks: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectsRepository,
        },
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientsRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a project successfully when all data is valid', async () => {
      const createProjectDto = {
        name: 'New Project',
        description: 'New project description',
        client_id: 'client-1',
        status: ProjectStatus.IN_PROGRESS,
        sold_hours: 150,
        spent_hours: 0,
      };

      const savedProject = { ...mockProject, ...createProjectDto };
      mockClientsRepository.findOne.mockResolvedValue(mockClient);
      mockProjectsRepository.create.mockReturnValue(savedProject);
      mockProjectsRepository.save.mockResolvedValue(savedProject);

      const result = await service.create(createProjectDto);

      expect(mockClientsRepository.findOne).toHaveBeenCalledWith({
        where: { id: createProjectDto.client_id },
      });
      expect(mockProjectsRepository.create).toHaveBeenCalledWith(
        createProjectDto,
      );
      expect(mockProjectsRepository.save).toHaveBeenCalledWith(savedProject);
      expect(result).toEqual(savedProject);
    });

    it('should throw NotFoundException when client does not exist', async () => {
      const createProjectDto = {
        name: 'New Project',
        description: 'New project description',
        client_id: 'nonexistent-client',
      };

      mockClientsRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createProjectDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createProjectDto)).rejects.toThrow(
        'Client non trouvé',
      );

      expect(mockProjectsRepository.create).not.toHaveBeenCalled();
      expect(mockProjectsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when project name is empty', async () => {
      const createProjectDto = {
        name: '',
        description: 'Project without name',
        client_id: 'client-1',
      };

      await expect(service.create(createProjectDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createProjectDto)).rejects.toThrow(
        'Le nom du projet est requis',
      );

      expect(mockClientsRepository.findOne).not.toHaveBeenCalled();
      expect(mockProjectsRepository.create).not.toHaveBeenCalled();
      expect(mockProjectsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a project successfully when all data is valid', async () => {
      const updateProjectDto = {
        name: 'Updated Project',
        description: 'Updated description',
        status: ProjectStatus.COMPLETED,
        sold_hours: 200,
      };

      const updatedProject = { ...mockProject, ...updateProjectDto };
      mockProjectsRepository.findOne.mockResolvedValue(mockProject);
      mockProjectsRepository.save.mockResolvedValue(updatedProject);

      const result = await service.update(mockProject.id, updateProjectDto);

      expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProject.id },
        relations: ['client', 'tasks'],
      });
      expect(mockProjectsRepository.save).toHaveBeenCalledWith(updatedProject);
      expect(result).toEqual(updatedProject);
    });

    it('should throw NotFoundException when project does not exist', async () => {
      const updateProjectDto = {
        name: 'Updated Project',
        description: 'Updated description',
      };

      mockProjectsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent-id', updateProjectDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update('nonexistent-id', updateProjectDto),
      ).rejects.toThrow('Projet non trouvé');

      expect(mockProjectsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when client does not exist in update', async () => {
      const updateProjectDto = {
        name: 'Updated Project',
        client_id: 'nonexistent-client',
      };

      mockProjectsRepository.findOne.mockResolvedValue(mockProject);
      mockClientsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(mockProject.id, updateProjectDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update(mockProject.id, updateProjectDto),
      ).rejects.toThrow('Client non trouvé');

      expect(mockProjectsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when project name is empty in update', async () => {
      const updateProjectDto = {
        name: '',
        description: 'Updated but no name',
      };

      await expect(
        service.update(mockProject.id, updateProjectDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.update(mockProject.id, updateProjectDto),
      ).rejects.toThrow('Le nom du projet est requis');

      expect(mockProjectsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove project successfully', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(mockProject);
      mockProjectsRepository.remove.mockResolvedValue(mockProject);

      await service.remove(mockProject.id);

      expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProject.id },
        relations: ['client', 'tasks'],
      });
      expect(mockProjectsRepository.remove).toHaveBeenCalledWith(mockProject);
    });

    it('should throw NotFoundException when project does not exist', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        'Projet non trouvé',
      );

      expect(mockProjectsRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const allProjects = [
        mockProject,
        { ...mockProject, id: 'project-2', name: 'Project 2' },
      ];
      mockProjectsRepository.find.mockResolvedValue(allProjects);

      const result = await service.findAll();

      expect(mockProjectsRepository.find).toHaveBeenCalledWith({
        relations: ['client', 'tasks'],
      });
      expect(result).toEqual(allProjects);
    });

    it('should return empty array when no projects exist', async () => {
      mockProjectsRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return project when found by id', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findOne(mockProject.id);

      expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProject.id },
        relations: ['client', 'tasks'],
      });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException when project not found by id', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        'Projet non trouvé',
      );
    });
  });

  describe('findByClient', () => {
    it('should return projects for specific client', async () => {
      const clientProjects = [
        mockProject,
        { ...mockProject, id: 'project-2', name: 'Project 2' },
      ];
      mockProjectsRepository.find.mockResolvedValue(clientProjects);

      const result = await service.findByClient('client-1');

      expect(mockProjectsRepository.find).toHaveBeenCalledWith({
        where: { client_id: 'client-1' },
        relations: ['client', 'tasks'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(clientProjects);
    });

    it('should return empty array when client has no projects', async () => {
      mockProjectsRepository.find.mockResolvedValue([]);

      const result = await service.findByClient('client-without-projects');

      expect(result).toEqual([]);
    });

    it('should return empty array when client does not exist', async () => {
      mockProjectsRepository.find.mockResolvedValue([]);

      const result = await service.findByClient('nonexistent-client');

      expect(result).toEqual([]);
    });
  });
});
