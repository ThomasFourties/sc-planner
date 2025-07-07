import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    role: UserRole.CLIENT,
    is_admin: false,
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01'),
  };

  const mockChefDeProjet: User = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    password: 'hashed_password',
    role: UserRole.CHEF_DE_PROJET,
    is_admin: true,
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
    it('should return an array of users', async () => {
      const users = [mockUser, mockChefDeProjet];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(users);
    });

    it('should return an empty array when no users exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: UserRole.CLIENT,
        is_admin: false,
      };

      mockRepository.create.mockReturnValue(userData as User);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(userData);

      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });

    it('should create a user with minimal data', async () => {
      const minimalUserData = {
        email: 'minimal@example.com',
        password: 'password',
      };

      const minimalUser = {
        ...mockUser,
        email: 'minimal@example.com',
      };

      mockRepository.create.mockReturnValue(minimalUserData as User);
      mockRepository.save.mockResolvedValue(minimalUser);

      const result = await service.create(minimalUserData);

      expect(mockRepository.create).toHaveBeenCalledWith(minimalUserData);
      expect(result).toEqual(minimalUser);
    });

    it('should create a chef de projet user', async () => {
      const chefData = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        password: 'hashed_password',
        role: UserRole.CHEF_DE_PROJET,
        is_admin: true,
      };

      mockRepository.create.mockReturnValue(chefData as User);
      mockRepository.save.mockResolvedValue(mockChefDeProjet);

      const result = await service.create(chefData);

      expect(mockRepository.create).toHaveBeenCalledWith(chefData);
      expect(result).toEqual(mockChefDeProjet);
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
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
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by id', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateData = { first_name: 'Updated John' };
      const updatedUser = { ...mockUser, ...updateData };

      // Mock findById calls (before and after update)
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser) // First call in update method
        .mockResolvedValueOnce(updatedUser); // Second call after update

      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(mockUser.id, updateData);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
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

    it('should throw InternalServerErrorException when update fails', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue({ affected: 0 });

      await expect(
        service.update(mockUser.id, { first_name: 'Updated' }),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        service.update(mockUser.id, { first_name: 'Updated' }),
      ).rejects.toThrow('Erreur lors de la mise à jour');
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(mockUser.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
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

    it('should throw BadRequestException when trying to delete a chef de projet', async () => {
      mockRepository.findOne.mockResolvedValue(mockChefDeProjet);

      await expect(service.delete(mockChefDeProjet.id)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.delete(mockChefDeProjet.id)).rejects.toThrow(
        'Impossible de supprimer un chef de projet',
      );

      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when delete fails', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(mockUser.id)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.delete(mockUser.id)).rejects.toThrow(
        'Erreur lors de la suppression',
      );
    });

    it('should successfully delete users with different roles (not chef de projet)', async () => {
      const userRoles = [UserRole.CLIENT, UserRole.FREELANCE, UserRole.SALARIE];

      for (const role of userRoles) {
        const userWithRole = { ...mockUser, role };
        mockRepository.findOne.mockResolvedValue(userWithRole);
        mockRepository.delete.mockResolvedValue({ affected: 1 });

        const result = await service.delete(userWithRole.id);

        expect(result).toEqual({ message: 'Utilisateur supprimé avec succès' });
        jest.clearAllMocks();
      }
    });
  });

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
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
