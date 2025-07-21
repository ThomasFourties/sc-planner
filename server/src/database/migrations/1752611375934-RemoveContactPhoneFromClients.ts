import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveContactPhoneFromClients1752611375934
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Supprimer la colonne contact_phone de la table clients
    await queryRunner.query(
      `ALTER TABLE "clients" DROP COLUMN IF EXISTS "contact_phone"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recréer la colonne contact_phone (optionnel pour rollback)
    await queryRunner.query(
      `ALTER TABLE "clients" ADD COLUMN "contact_phone" varchar NULL`,
    );
  }
}
