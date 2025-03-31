import { FastifyInstance } from "fastify";
import dataSource from "../dataSource";
import { User } from "../entities/User";

export async function userRoutes(
    fastify: FastifyInstance,
    options: {}
): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    fastify.get("/users", async (_req, _reply) => {
        return {
            users: await userRepository.find(),
        };
    });
}
