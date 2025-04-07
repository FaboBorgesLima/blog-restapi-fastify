import { Repository } from "typeorm";
import { AuthenticationService } from "../../src/services/AuthenticationService";
import { User } from "../../src/entities/User";
import { describe, beforeEach, it } from "node:test";
import assert from "assert";

describe("AuthenticationService", () => {
    let userRepository: Repository<User>;
    let authenticationService: AuthenticationService;

    beforeEach(() => {
        userRepository = {
            findOneOrFail: async () => {
                throw new Error("Method not implemented.");
            },
        } as unknown as Repository<User>;
        authenticationService = new AuthenticationService(userRepository);
    });

    it("should throw an error if authorization header is missing", async () => {
        try {
            await authenticationService.getTokenUser("");
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual(
                (error as Error).message,
                "Authorization header is missing"
            );
        }
    });

    it("should throw an error if token is missing", async () => {
        try {
            await authenticationService.getTokenUser("Bearer ");
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "Token is missing");
        }
    });

    it("should return a user if token is valid", async () => {
        const mockUser = { id: 1, token: "valid-token" } as unknown as User;
        userRepository.findOneOrFail = async () => mockUser;

        const user = await authenticationService.getTokenUser(
            "Bearer valid-token"
        );

        assert.strictEqual(user, mockUser);
    });

    it("should throw an error if user is not found", async () => {
        userRepository.findOneOrFail = async (conditions: any) => {
            if (conditions.where.token === "invalid-token") {
                throw new Error("User not found");
            }
            return { id: 1, token: conditions.where.token } as unknown as User;
        };

        try {
            await authenticationService.getTokenUser("Bearer invalid-token");
            assert.fail("Expected an error to be thrown");
        } catch (error) {
            assert.strictEqual((error as Error).message, "User not found");
        }
    });
});
