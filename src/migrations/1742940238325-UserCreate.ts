import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserCreate1742940238325 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        name: "id",
                        type: "bigint",
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "char",
                        isNullable: false,
                        length: "43",
                    },
                    {
                        name: "token",
                        type: "char",
                        isNullable: false,
                        length: "43",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: "github",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "website",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "linkedin",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable(new Table({ name: "user" }));
    }
}
