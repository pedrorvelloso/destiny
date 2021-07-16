import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddIncentiveRelationToDonation1591121608332
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'donations',
      new TableColumn({
        name: 'donation_incentive',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'donations',
      new TableForeignKey({
        columnNames: ['donation_incentive'],
        referencedColumnNames: ['id'],
        referencedTableName: 'incentive_options',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('donations');
    const foreignKey = table?.foreignKeys.find(
      fk => fk.columnNames.indexOf('donation_incentive') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('donations', foreignKey);
    }
    await queryRunner.dropColumn('donations', 'donation_incentive');
  }
}
