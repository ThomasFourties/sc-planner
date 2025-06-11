import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../dto/user.dto';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Identifiant unique de l\'utilisateur',
    example: 'e7f3c4a5-8b2d-4f1e-9c6a-3d5f7e9b2c8a',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'John',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Doe',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'john.doe@example.com',
    format: 'email',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({
    description: 'Mot de passe haché de l\'utilisateur',
    writeOnly: true,
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    description: 'Statut de vérification de l\'email',
    example: true,
    default: false,
  })
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'Code de vérification email (usage interne)',
    example: null,
    required: false,
  })
  @Column({ type: 'varchar', length: 10, nullable: true })
  emailVerificationCode: string | null;

  @ApiProperty({
    description: 'Date d\'expiration du code de vérification (usage interne)',
    example: null,
    required: false,
  })
  @Column({ type: 'timestamp', nullable: true })
  emailVerificationExpires: Date | null;

  @ApiProperty({
    description: 'Token de réinitialisation du mot de passe (usage interne)',
    example: null,
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  resetPasswordToken: string | null;

  @ApiProperty({
    description: 'Date d\'expiration du token de réinitialisation (usage interne)',
    example: null,
    required: false,
  })
  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur dans le système',
    enum: UserRole,
    example: UserRole.CLIENT,
    default: UserRole.CLIENT,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Statut administrateur de l\'utilisateur',
    example: false,
    default: false,
  })
  @Column({ default: false })
  is_admin: boolean;

  @ApiProperty({
    description: 'URL de l\'image de profil',
    example: 'https://example.com/profile.jpg',
    required: false,
    maxLength: 255,
  })
  @Column({ length: 255, nullable: true })
  profile_img: string;

  @ApiProperty({
    description: 'Date de création de l\'utilisateur',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour de l\'utilisateur',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
