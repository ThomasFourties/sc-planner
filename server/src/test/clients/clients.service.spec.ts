import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientsService } from '../../clients/clients.service';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';
import { Project, ProjectStatus } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ClientsService', () => {
  let service: ClientsService;

  // Mock QueryBuilder
  const mockQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  };

  // Mock Repositories
  const mockClientRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    manager: {
      transaction: jest.fn(),
      getRepository: jest.fn(),
    },
  };

  const mockUserRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    manager: {
      query: jest.fn(),
    },
  };

  const mockProjectRepository = {
    delete: jest.fn(),
  };

  const mockTaskRepository = {
    delete: jest.fn(),
  };

  // Mock Data selon les vraies entités
  const mockClient: Client = {
    id: 'client-1',
    name: 'Test Client',
    description: 'A test client',
    logo: 'logo.png',
    website_prod: 'https://prod.test.com',
    website_preprod: 'https://preprod.test.com',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    users: [], // OneToMany - peut être vide
    projects: [], // OneToMany - peut être vide
  };

  const mockUser: User = {
    id: 'user-1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@test.com',
    password: 'hashed_password',
    role: UserRole.CLIENT,
    is_admin: false,
    client_id: 'client-1', // ManyToOne - optionnel
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    client: mockClient, // Relation optionnelle
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
    client_id: 'client-1', // ManyToOne - obligatoire
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    client: mockClient, // Relation obligatoire
    tasks: [], // OneToMany - peut être vide
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: mockProjectRepository,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a client without users', async () => {
      const createClientDto = {
        name: 'New Client',
        description: 'New client description',
      };

      const savedClient = { ...mockClient, ...createClientDto };
      mockClientRepository.create.mockReturnValue(savedClient);
      mockClientRepository.save.mockResolvedValue(savedClient);
      mockClientRepository.findOne.mockResolvedValue(savedClient);

      const result = await service.create(createClientDto);

      expect(mockClientRepository.create).toHaveBeenCalledWith(createClientDto);
      expect(mockClientRepository.save).toHaveBeenCalledWith(savedClient);
      expect(mockUserRepository.createQueryBuilder).not.toHaveBeenCalled();
      expect(result).toEqual(savedClient);
    });

    it('should create a client with users', async () => {
      const createClientDto = {
        name: 'New Client',
        description: 'New client description',
        user_ids: ['user-1', 'user-2'],
      };

      const savedClient = { ...mockClient, ...createClientDto };

      mockClientRepository.create.mockReturnValue(savedClient);
      mockClientRepository.save.mockResolvedValue(savedClient);
      mockClientRepository.findOne.mockResolvedValue(savedClient);
      mockQueryBuilder.execute.mockResolvedValue({ affected: 2 });

      const result = await service.create(createClientDto);

      expect(mockClientRepository.create).toHaveBeenCalledWith({
        name: createClientDto.name,
        description: createClientDto.description,
      });

      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({
        client: savedClient,
      });
      expect(result).toEqual(savedClient);
    });

    it('should throw an error if the client name is not provided', async () => {
      const createClientDto = {
        name: '',
      };

      await expect(service.create(createClientDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createClientDto)).rejects.toThrow(
        'Le nom du client est requis',
      );

      expect(mockClientRepository.save).not.toHaveBeenCalled();
      expect(mockUserRepository.createQueryBuilder).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a client successfully', async () => {
      const updateClientDto = {
        name: 'Updated Client',
        description: 'Updated description',
      };

      const updatedClient = { ...mockClient, ...updateClientDto };
      mockClientRepository.findOne.mockResolvedValue(mockClient);
      mockClientRepository.update.mockResolvedValue({ affected: 1 });
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedClient);

      const result = await service.update(mockClient.id, updateClientDto);

      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockClient.id },
      });
      expect(mockClientRepository.update).toHaveBeenCalledWith(
        mockClient.id,
        updateClientDto,
      );
      expect(result).toEqual(updatedClient);
    });

    it('should throw NotFoundException when client does not exist', async () => {
      const updateClientDto = { name: 'Updated Client' };
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent-id', updateClientDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update('nonexistent-id', updateClientDto),
      ).rejects.toThrow('Client non trouvé');
    });

    it('should throw an error if the client name is empty', async () => {
      const updateClientDto = {
        name: '',
      };

      await expect(
        service.update(mockClient.id, updateClientDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.update(mockClient.id, updateClientDto),
      ).rejects.toThrow('Le nom du client est requis');

      expect(mockClientRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove client and cascade delete projects and tasks', async () => {
      const clientWithProjects = {
        ...mockClient,
        projects: [mockProject],
      };

      const mockClientRepo = {
        findOne: jest.fn().mockResolvedValue(clientWithProjects),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
      };
      const mockUserRepo = {
        createQueryBuilder: jest.fn(() => mockQueryBuilder),
      };
      const mockProjectRepo = {
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
      };
      const mockTaskRepo = {
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
      };

      mockClientRepository.manager.transaction.mockImplementation((callback) =>
        callback({
          getRepository: jest.fn((entity) => {
            if (entity === Client) return mockClientRepo;
            if (entity === User) return mockUserRepo;
            if (entity === Project) return mockProjectRepo;
            if (entity === Task) return mockTaskRepo;
          }),
        }),
      );

      mockQueryBuilder.execute.mockResolvedValue({ affected: 1 });

      await service.remove(mockClient.id);

      expect(mockClientRepo.findOne).toHaveBeenCalledWith({
        where: { id: mockClient.id },
        relations: ['projects', 'users'],
      });
      expect(mockUserRepo.createQueryBuilder).toHaveBeenCalled();
      expect(mockTaskRepo.delete).toHaveBeenCalledWith({
        project_id: mockProject.id,
      });
      expect(mockProjectRepo.delete).toHaveBeenCalledWith({
        client_id: mockClient.id,
      });
      expect(mockClientRepo.delete).toHaveBeenCalledWith({ id: mockClient.id });
    });

    it('should throw NotFoundException when client does not exist', async () => {
      const mockClientRepo = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      mockClientRepository.manager.transaction.mockImplementation((callback) =>
        callback({
          getRepository: jest.fn(() => mockClientRepo),
        }),
      );

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        'Client non trouvé',
      );
    });
  });

  describe('findOne', () => {
    it('should return client when found', async () => {
      const clientWithStats = {
        ...mockClient,
        projects: [mockProject],
        stats: {
          projectsCount: 1,
          totalSoldHours: 100,
          totalSpentHours: 80,
        },
      };

      mockClientRepository.findOne.mockResolvedValue({
        ...mockClient,
        projects: [mockProject],
      });

      const result = await service.findOne(mockClient.id);

      expect(mockClientRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockClient.id },
        relations: ['projects', 'users'],
      });
      expect(result).toEqual(clientWithStats);
    });

    it('should throw NotFoundException when client not found', async () => {
      mockClientRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        'Client non trouvé',
      );
    });
  });

  describe('findAll', () => {
    it('should return all clients with datas', async () => {
      const clientsData = [
        {
          ...mockClient,
          projects: [mockProject],
        },
        {
          ...mockClient,
          id: 'client-2',
          name: 'Second Client',
          projects: [],
        },
      ];

      mockClientRepository.find.mockResolvedValue(clientsData);

      const result = await service.findAll();

      expect(mockClientRepository.find).toHaveBeenCalledWith({
        relations: ['projects', 'users'],
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        ...clientsData[0],
        stats: {
          projectsCount: 1,
          totalSoldHours: 100,
          totalSpentHours: 80,
        },
      });
      expect(result[1]).toEqual({
        ...clientsData[1],
        stats: {
          projectsCount: 0,
          totalSoldHours: 0,
          totalSpentHours: 0,
        },
      });
    });

    it('should return empty array when no clients exist', async () => {
      mockClientRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
