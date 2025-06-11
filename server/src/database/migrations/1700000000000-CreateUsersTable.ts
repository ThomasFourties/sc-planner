import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1700000000000 implements MigrationInterface {
  name = 'CreateUsersTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    if (!table) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'first_name',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'last_name',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isUnique: true,
            },
            {
              name: 'password',
              type: 'varchar',
              length: '255',
            },
            {
              name: 'role',
              type: 'enum',
              enum: ['SALARIE', 'CHEF_DE_PROJET', 'FREELANCE', 'CLIENT'],
              default: "'CLIENT'",
            },
            {
              name: 'is_admin',
              type: 'boolean',
              default: false,
            },
            {
              name: 'profile_img',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'reset_token',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'reset_expires',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
