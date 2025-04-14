import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";

export class PostCategoryCreate1744519537468 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name: "post_category",
                columns: [
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    { name: "createdAt", type: "timestamp", default: "now()" },
                    { name: "updatedAt", type: "timestamp", default: "now()" },
                    { name: "deletedAt", type: "timestamp", isNullable: true },
                    {
                        name: "id",
                        type: "bigint",
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: "userId",
                        type: "bigint",
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        queryRunner.createForeignKey(
            "post_category",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
