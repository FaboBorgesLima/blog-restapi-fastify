import fastify, { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, it } from "node:test";
import { dataSourcePlugin } from "../../src/plugins/dataSourcePlugin";
import { userRoutes } from "../../src/routes/userRoutes";
import assert from "node:assert";
import { RandomTokenService } from "../../src/services/RandomTokenService";
import { UserSchemaType } from "../../src/Schemas/User/UserSchema";
import dataSource from "../../src/dataSource";
import { User } from "../../src/entities/User";
import { HashService } from "../../src/services/HashService";
import { UserRepository } from "../../src/repositories/UserRepository";

describe("userRoutes", () => {
    let instance!: FastifyInstance;

    beforeEach(async () => {
        instance = fastify();
        instance.register(dataSourcePlugin);
        instance.register(userRoutes);
    });

    afterEach(async () => {
        await UserRepository.delete({});
    });

    it("create", async () => {
        let res = await instance.inject({
            url: "/users",
            method: "post",
            body: {},
        });

        assert.equal(res.statusCode, 400);

        res = await instance.inject({
            url: "/users",
            method: "post",
            body: {
                name: RandomTokenService.make(),
                email: `${RandomTokenService.make()}@gmail.com`,
                password: RandomTokenService.make(),
            },
        });

        assert.equal(res.statusCode, 200);
    });

    it("read", async () => {
        for (let i = 0; i < 10; i++)
            await instance.inject({
                url: "/users",
                method: "post",
                body: {
                    name: RandomTokenService.make(),
                    email: `${RandomTokenService.make()}@gmail.com`,
                    password: RandomTokenService.make(),
                },
            });

        let res = await instance
            .inject()
            .get("/users")
            .query({ size: "10", page: "0" });

        assert.equal(res.statusCode, 200);

        let resBody = res.json();

        assert.equal(resBody.users.length, 10);

        const userSchema: UserSchemaType = resBody.users[0];

        res = await instance.inject().get(`/users/${userSchema.id}`);

        assert.equal(res.statusCode, 200);
        assert.equal(res.json().user.name, userSchema.name);
        assert.equal(res.json().user.email, userSchema.email);
        assert.equal(res.json().user.id, userSchema.id);
        assert.equal(res.json().user.password, undefined);
        assert.equal(res.json().user.token, undefined);
    });

    it("update", async () => {
        const repo = dataSource.getRepository(User);

        let user = new User();
        user.name = RandomTokenService.make();
        user.password = HashService.make("pwd");
        user.email = `${RandomTokenService.make()}@email.com`;

        user = await repo.save(user);

        let res = await instance
            .inject()
            .put(`/users/${user.id}`)
            .body({
                password: HashService.make("otherpwd"),
            })
            .headers({
                authorization: `Bearer ${user.token}`,
            });

        assert.equal(res.statusCode, 200);

        res = await instance.inject().put(`/users/${user.id}`).body({});

        assert.equal(res.statusCode, 400);
    });

    it("delete", async () => {
        const repo = dataSource.getRepository(User);

        let user = new User();

        user.name = RandomTokenService.make();
        user.password = HashService.make("pwd");
        user.email = `${RandomTokenService.make()}@email.com`;

        user = await repo.save(user);

        let res = await instance
            .inject()
            .delete(`/users/${user.id}`)
            .headers({
                authorization: `Bearer ${RandomTokenService.make()}`,
            });

        assert.equal(res.statusCode, 500);

        res = await instance
            .inject()
            .delete(`/users/${user.id}`)
            .headers({
                authorization: `Bearer ${user.token}`,
            });

        assert.equal(res.statusCode, 200);
    });
});
