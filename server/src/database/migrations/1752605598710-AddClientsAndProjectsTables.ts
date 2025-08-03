import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClientsAndProjectsTables1752605598710 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Créer la table clients
        await queryRunner.query(`
            CREATE TABLE "clients" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "logo" character varying,
                "website_prod" character varying,
                "website_preprod" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_clients" PRIMARY KEY ("id")
            )
        `);

        // Créer la table projects
        await queryRunner.query(`
            CREATE TABLE "projects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" text,
                "status" character varying NOT NULL DEFAULT 'in_progress',
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

        // Ajouter la colonne project_id à la table tasks si elle n'existe pas
        await queryRunner.query(`
            ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "project_id" uuid,
            ADD CONSTRAINT "FK_tasks_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la contrainte de clé étrangère de tasks
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT IF EXISTS "FK_tasks_project"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN IF EXISTS "project_id"`);

        // Supprimer la table projects
        await queryRunner.query(`DROP TABLE "projects"`);

        // Supprimer la table clients
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
