import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddReviewedByDonation1590158427718
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'donations',
      new TableColumn(
        new TableColumn({
          name: 'reviewed_by',
          type: 'uuid',
          isNullable: true,
        }),
      ),
    );

    await queryRunner.createForeignKey(
      'donations',
      new TableForeignKey({
        columnNames: ['reviewed_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('donations');
    const foreignKey = table?.foreignKeys.find(
      fk => fk.columnNames.indexOf('reviewed_by') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('donations', foreignKey);
    }
    await queryRunner.dropColumn('donations', 'reviewed_by');
  }
}
