import { FastifyInstance } from "fastify";

export async function healthCheckRoute(
    fastify: FastifyInstance,
    options: {}
): Promise<void> {
    fastify.get("/health-check", (_req, _reply) => {
        return { hello: "world" };
    });
}
