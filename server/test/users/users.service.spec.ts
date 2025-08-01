import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/users/entities/user.entity';
import { UserRole } from '../../src/users/enums/user-role.enum';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockClient = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Client',
    description: 'Test client description',
    logo: 'logo.png',
    website_prod: 'https://prod.test.com',
    website_preprod: 'https://preprod.test.com',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
    users: [],
    projects: [],
  };

  const mockUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    role: UserRole.CLIENT,
    is_admin: false,
    client_id: mockClient.id,
    client: mockClient,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });



  describe('findAll', () => {
    it('should return an array of all users', async () => {
      const users = [mockUser];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['client'],
      });
      expect(result).toEqual(users);
    });

    it('should return an empty array when no users exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        relations: ['client'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user when found by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: ['client'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by id', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });



  // describe('unassignClient', () => {
  //   it('should unassign a client from a user successfully', async () => {
  //     const userWithClient = { ...mockUser, client_id: mockClient.id };
  //     const userWithoutClient = { ...mockUser, client_id: undefined };

  //     mockRepository.findOne
  //       .mockResolvedValueOnce(userWithClient)
  //       .mockResolvedValueOnce(userWithoutClient);

  //     mockRepository.update.mockResolvedValue({ affected: 1 });

  //     const result = await service.unassignClient(mockUser.id);

  //     expect(mockRepository.findOne).toHaveBeenCalledWith({
  //       where: { id: mockUser.id },
  //       relations: ['client'],
  //     });
  //     expect(mockRepository.update).toHaveBeenCalledWith(mockUser.id, {
  //       client_id: undefined,
  //     });
  //     expect(result).toEqual(userWithoutClient);
  //   });

  //   it('should throw NotFoundException when user does not exist', async () => {
  //     mockRepository.findOne.mockResolvedValue(null);

  //     await expect(service.unassignClient('nonexistent-id')).rejects.toThrow(
  //       NotFoundException,
  //     );
  //     await expect(service.unassignClient('nonexistent-id')).rejects.toThrow(
  //       'Utilisateur non trouvé',
  //     );

  //     expect(mockRepository.update).not.toHaveBeenCalled();
  //   });

  //   it('should throw InternalServerErrorException when unassignment fails', async () => {
  //     mockRepository.findOne.mockResolvedValue(mockUser);
  //     mockRepository.update.mockResolvedValue({ affected: 0 });

  //     await expect(service.unassignClient(mockUser.id)).rejects.toThrow(
  //       InternalServerErrorException,
  //     );
  //     await expect(service.unassignClient(mockUser.id)).rejects.toThrow(
  //       'Erreur lors de la désassignation du client',
  //     );
  //   });

  //   it('should handle unassigning user who has no client', async () => {
  //     const userWithoutClient = {
  //       ...mockChefDeProjet,
  //       client_id: undefined,
  //       client: undefined,
  //     };
  //     mockRepository.findOne
  //       .mockResolvedValueOnce(userWithoutClient)
  //       .mockResolvedValueOnce(userWithoutClient);
  //     mockRepository.update.mockResolvedValue({ affected: 1 });

  //     const result = await service.unassignClient(mockChefDeProjet.id);

  //     expect(mockRepository.findOne).toHaveBeenCalledWith({
  //       where: { id: mockChefDeProjet.id },
  //       relations: ['client'],
  //     });
  //     expect(mockRepository.update).toHaveBeenCalledWith(mockChefDeProjet.id, {
  //       client_id: undefined,
  //     });
  //     expect(result).toEqual(userWithoutClient);
  //   });
  // });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateData = { first_name: 'Updated John' };
      const updatedUser = { ...mockUser, ...updateData };

      mockRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updatedUser);

      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(mockUser.id, updateData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: ['client'],
      });
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockUser.id,
        updateData,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent-id', { first_name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update('nonexistent-id', { first_name: 'Updated' }),
      ).rejects.toThrow('Utilisateur non trouvé');

      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(mockUser.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: ['client'],
      });
      expect(mockRepository.delete).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({ message: 'Utilisateur supprimé avec succès' });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.delete('nonexistent-id')).rejects.toThrow(
        'Utilisateur non trouvé',
      );

      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        relations: ['client'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getProfile('nonexistent-id')).rejects.toThrow(
        'Utilisateur non trouvé',
      );
    });
  });
});
