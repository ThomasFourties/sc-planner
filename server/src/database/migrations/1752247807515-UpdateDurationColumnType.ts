import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDurationColumnType1752247807515
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Changer le type de la colonne duration de INT vers DECIMAL(5,2)
    await queryRunner.query(
      `ALTER TABLE tasks ALTER COLUMN duration TYPE DECIMAL(5,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revenir au type INT en cas de rollback
    await queryRunner.query(
      `ALTER TABLE tasks ALTER COLUMN duration TYPE INTEGER`,
    );
  }
}
