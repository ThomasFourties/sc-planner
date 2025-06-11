import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserForAuth1704800000000 implements MigrationInterface {
  name = 'UpdateUserForAuth1704800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Renommer les colonnes existantes
    await queryRunner.renameColumn('users', 'firstName', 'firstName');
    await queryRunner.renameColumn('users', 'lastName', 'lastName');
    await queryRunner.renameColumn('users', 'createdAt', 'createdAt');
    await queryRunner.renameColumn('users', 'updatedAt', 'updatedAt');

    // Ajouter les nouveaux champs pour l'authentification
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'isEmailVerified',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'emailVerificationCode',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'emailVerificationExpires',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'resetPasswordToken',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'resetPasswordExpires',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les colonnes ajoutées
    await queryRunner.dropColumns('users', [
      'isEmailVerified',
      'emailVerificationCode',
      'emailVerificationExpires',
      'resetPasswordToken',
      'resetPasswordExpires',
    ]);

    // Renommer les colonnes vers l'ancien format
    await queryRunner.renameColumn('users', 'firstName', 'firstName');
    await queryRunner.renameColumn('users', 'lastName', 'lastName');
    await queryRunner.renameColumn('users', 'createdAt', 'createdAt');
    await queryRunner.renameColumn('users', 'updatedAt', 'updatedAt');
  }
} 