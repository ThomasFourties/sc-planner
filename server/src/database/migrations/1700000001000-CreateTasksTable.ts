import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Créer la table tasks
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "duration" integer NOT NULL DEFAULT 0,
        "assigned_to_id" uuid,
        "created_by_id" uuid NOT NULL,
        "start_date" TIMESTAMP,
        "end_date" TIMESTAMP,
        "status" character varying NOT NULL DEFAULT 'todo',
        "priority" character varying NOT NULL DEFAULT 'medium',
        "dependency_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
      )
    `);

    // Créer les types enum
    await queryRunner.query(`
      CREATE TYPE "public"."tasks_status_enum" AS ENUM(
        'not_started', 'in_progress', 'done', 'todo', 'blocked'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."tasks_priority_enum" AS ENUM(
        'low', 'medium', 'high'
      )
    `);

    // Modifier les colonnes pour utiliser les types enum
    // D'abord supprimer les valeurs par défaut
    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ALTER COLUMN "status" DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ALTER COLUMN "priority" DROP DEFAULT
    `);

    // Puis changer le type
    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ALTER COLUMN "status" TYPE "public"."tasks_status_enum" 
      USING "status"::"public"."tasks_status_enum"
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ALTER COLUMN "priority" TYPE "public"."tasks_priority_enum" 
      USING "priority"::"public"."tasks_priority_enum"
    `);

    // Enfin remettre les valeurs par défaut
    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ALTER COLUMN "status" SET DEFAULT 'todo'
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ALTER COLUMN "priority" SET DEFAULT 'medium'
    `);

    // Créer les index
    await queryRunner.query(`
      CREATE INDEX "IDX_TASKS_STATUS" ON "tasks" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASKS_PRIORITY" ON "tasks" ("priority")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASKS_ASSIGNED_TO" ON "tasks" ("assigned_to_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASKS_CREATED_BY" ON "tasks" ("created_by_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_TASKS_DATES" ON "tasks" ("start_date", "end_date")
    `);

    // Créer les clés étrangères
    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ADD CONSTRAINT "FK_TASKS_ASSIGNED_TO" 
      FOREIGN KEY ("assigned_to_id") 
      REFERENCES "users"("id") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ADD CONSTRAINT "FK_TASKS_CREATED_BY" 
      FOREIGN KEY ("created_by_id") 
      REFERENCES "users"("id") 
      ON DELETE CASCADE 
      ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "tasks" 
      ADD CONSTRAINT "FK_TASKS_DEPENDENCY" 
      FOREIGN KEY ("dependency_id") 
      REFERENCES "tasks"("id") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les clés étrangères
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_TASKS_DEPENDENCY"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_TASKS_CREATED_BY"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_TASKS_ASSIGNED_TO"`);

    // Supprimer les index
    await queryRunner.query(`DROP INDEX "IDX_TASKS_DATES"`);
    await queryRunner.query(`DROP INDEX "IDX_TASKS_CREATED_BY"`);
    await queryRunner.query(`DROP INDEX "IDX_TASKS_ASSIGNED_TO"`);
    await queryRunner.query(`DROP INDEX "IDX_TASKS_PRIORITY"`);
    await queryRunner.query(`DROP INDEX "IDX_TASKS_STATUS"`);

    // Supprimer la table
    await queryRunner.query(`DROP TABLE "tasks"`);

    // Supprimer les types enum
    await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
  }
} 