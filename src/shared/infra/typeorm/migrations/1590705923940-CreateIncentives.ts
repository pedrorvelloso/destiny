import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateIncentives1590705923940
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'incentives',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'game_id',
            type: 'int',
          },
          {
            name: 'event_id',
            type: 'int',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['meta', 'option'],
          },
          {
            name: 'enable_option',
            type: 'boolean',
          },
          {
            name: 'meta',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'ended_at',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'CreatedBy',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['created_by'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'IncentiveGame',
            referencedTableName: 'games',
            referencedColumnNames: ['id'],
            columnNames: ['game_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'Event',
            referencedTableName: 'events',
            referencedColumnNames: ['id'],
            columnNames: ['event_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('incentives');
  }
}
