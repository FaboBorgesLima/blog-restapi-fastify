import { before, beforeEach, describe, it } from "node:test";
import { authenticationRoutes } from "../../src/routes/authenticationRoutes";
import fastify, { FastifyInstance } from "fastify";
import assert from "node:assert";
import { UserRepository } from "../../src/repositories/UserRepository";
import { User } from "../../src/entities/User";
import dataSource from "../../src/dataSource";

describe("authenticationRoutes", () => {
    let instance: FastifyInstance;

    before(async () => {
        // Initialize the data source
        await dataSource.initialize();
    });

    beforeEach(async () => {
        instance = fastify();
        instance.register(authenticationRoutes);

        await UserRepository.delete({});
    });

    it("login", async () => {
        // Create a test user
        let user = new User({
            name: "testuser",
            password: "testpassword",
            email: "testuser@example.com",
        });

        user = await UserRepository.save(user);

        const response = await instance.inject({
            method: "POST",
            url: "/login",
            payload: {
                email: "testuser@example.com",
                password: "testpassword",
            },
        });

        assert.equal(response.statusCode, 200);

        const responseBody = JSON.parse(response.body);

        assert.equal(typeof responseBody.token, "string");
        assert.equal(responseBody.token.length > 0, true);
    });

    it("check token", async () => {
        // Create a test user
        let user = new User({
            name: "testuser",
            password: "testpassword",
            email: "testuser@example.com",
        });

        user = await UserRepository.save(user);
        // Simulate login to get a token
        const loginResponse = await instance.inject({
            method: "POST",
            url: "/login",
            payload: {
                email: "testuser@example.com",
                password: "testpassword",
            },
        });

        assert.equal(loginResponse.statusCode, 200);
        const responseBody = JSON.parse(loginResponse.body);
        // Simulate token check
        const checkTokenResponse = await instance.inject({
            method: "GET",
            url: "/check-token",
            headers: {
                authentication: `Bearer ${responseBody.token}`,
            },
        });

        // Check if the token is valid
        assert.equal(
            checkTokenResponse.statusCode,
            200,
            checkTokenResponse.body
        );
        const checkTokenResponseBody = JSON.parse(checkTokenResponse.body);
        assert.equal(checkTokenResponseBody.valid, true);
    });

    it("logout", async () => {
        // Create a test user

        const user = new User({
            name: "testuser",
            password: "testpassword",
            email: "testuser@example.com",
        });
        await UserRepository.save(user);
        // Simulate login to get a token
        const loginResponse = await instance.inject({
            method: "POST",
            url: "/login",
            payload: {
                email: "testuser@example.com",
                password: "testpassword",
            },
        });

        assert.equal(loginResponse.statusCode, 200);

        const responseBody = JSON.parse(loginResponse.body);

        // Simulate logout
        const logoutResponse = await instance.inject({
            method: "POST",
            url: "/logout",
            headers: {
                authentication: `Bearer ${responseBody.token}`,
            },
        });

        assert.equal(logoutResponse.statusCode, 200, logoutResponse.body);

        const checkTokenResponse = await instance.inject({
            method: "GET",
            url: "/check-token",
            headers: {
                authentication: `Bearer ${responseBody.token}`,
            },
        });

        const checkTokenResponseBody = JSON.parse(checkTokenResponse.body);

        assert.equal(checkTokenResponseBody.valid, false);
    });
});
