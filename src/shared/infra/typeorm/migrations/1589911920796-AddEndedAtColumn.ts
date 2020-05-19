import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddEndedAtColumn1589911920796
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'events',
      new TableColumn({
        name: 'ended_at',
        type: 'timestamp with time zone',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('events', 'ended_at');
  }
}
