import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixClientNullNames1752255000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update any NULL names to a default value
    await queryRunner.query(`
      UPDATE clients 
      SET name = 'Client Sans Nom ' || id::text 
      WHERE name IS NULL OR name = ''
    `);
    
    // Make sure we have the projects table and relations
    const hasProjectsTable = await queryRunner.hasTable('projects');
    if (!hasProjectsTable) {
      await queryRunner.query(`
        CREATE TABLE "projects" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NOT NULL,
          "description" text,
          "status" "projects_status_enum" NOT NULL DEFAULT 'planning',
          "start_date" date,
          "end_date" date,
          "sold_hours" numeric(10,2) NOT NULL DEFAULT '0',
          "spent_hours" numeric(10,2) NOT NULL DEFAULT '0',
          "client_id" uuid NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_projects" PRIMARY KEY ("id"),
          CONSTRAINT "FK_projects_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE
        )
      `);
    }
    
    // Update tasks table to have project_id if it doesn't exist
    const hasProjectIdColumn = await queryRunner.hasColumn('tasks', 'project_id');
    if (!hasProjectIdColumn) {
      await queryRunner.query(`
        ALTER TABLE "tasks" ADD "project_id" uuid
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This migration is not reversible as we can't restore NULL names
    // Just drop the projects table and project_id column if they were created
    await queryRunner.query(`DROP TABLE IF EXISTS "projects"`);
    
    const hasProjectIdColumn = await queryRunner.hasColumn('tasks', 'project_id');
    if (hasProjectIdColumn) {
      await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "project_id"`);
    }
  }
} 