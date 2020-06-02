import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class UpdateIncentiveTypeNameToGoal1591105158428
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'incentives',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['goal', 'option'],
      }),
    );

    await queryRunner.renameColumn('incentives', 'meta', 'goal');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'incentives',
      'type',
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['meta', 'option'],
      }),
    );

    await queryRunner.renameColumn('incentives', 'goal', 'meta');
  }
}
