import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixNullableColumns1749484000000 implements MigrationInterface {
  name = 'FixNullableColumns1749484000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Modifier les colonnes timestampes pour être explicites
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "emailVerificationExpires" TYPE timestamp`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "resetPasswordExpires" TYPE timestamp`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revenir aux types précédents si nécessaire
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "emailVerificationExpires" TYPE timestamp without time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "resetPasswordExpires" TYPE timestamp without time zone`,
    );
  }
}