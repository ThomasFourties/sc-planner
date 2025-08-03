import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompletedFieldToTasks1753000000000 implements MigrationInterface {
    name = 'AddCompletedFieldToTasks1753000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "completed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "completed"`);
    }
} 