import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
} from 'typeorm';


export class AddDeletedatToUserprofiles1773869935616 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user_profiles',
            new TableColumn({
                name: 'deleted_at',
                type: 'timestamp',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user_profiles', 'deleted_at');
    }

}
