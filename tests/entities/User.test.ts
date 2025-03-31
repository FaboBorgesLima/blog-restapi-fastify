import { User } from "../../src/entities/User";
import dataSource from "../../src/dataSource";
import { HashService } from "../../src/services/HashService";
import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import { QueryRunner, Repository } from "typeorm";

describe("user", async () => {
    let queryRunner!: QueryRunner;
    let repository!: Repository<User>;

    beforeEach(async () => {
        await Promise.all([dataSource.initialize()]);
        queryRunner = dataSource.createQueryRunner();
        repository = queryRunner.manager.getRepository(User);
        await queryRunner.startTransaction();
    });

    afterEach(async () => {
        await queryRunner.rollbackTransaction();
        await Promise.all([dataSource.destroy()]);
    });

    it("create", async () => {
        let user = new User();

        user.name = "name";
        user.password = HashService.make("pwd");
        user.email = "email@email.com";

        user = await repository.save(user);

        let user2 = repository.create({ ...user });

        user2.id = undefined;

        try {
            await repository.save(user2);

            assert.ok(false);
        } catch {
            assert.ok(true);
        }

        assert.equal(typeof user.id, "string");
        assert.equal(typeof user.token, "string");
        assert.equal(user.token.length, 43);
    });

    it("read", async () => {
        let user = repository.create();

        user.name = "name";
        user.password = HashService.make("pwd");
        user.email = "email@email.com";

        user = await repository.save(user);

        assert.equal(typeof user.id, "string");
        assert.equal(typeof user.token, "string");

        const userRead = await repository.findOneOrFail({
            where: { id: user.id },
        });

        assert.equal(userRead.token, user.token);
    });

    it("update", async () => {
        let user = repository.create();

        user.name = "name";
        user.password = HashService.make("pwd");
        user.email = "email@email.com";

        user = await repository.save(user);

        user.name = "other name";

        user = await repository.save(user);

        assert.equal(user.name, "other name");
    });

    it("delete", async () => {
        let user = new User();

        user.name = "name";
        user.password = HashService.make("pwd");
        user.email = "email@email.com";

        user = await repository.save(user);
    });
});
