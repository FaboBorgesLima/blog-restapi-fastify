import fastify, { FastifyInstance } from "fastify";
import { healthCheckRoute } from "./routes/healthCheckRoute";

export function app(): FastifyInstance {
    const server = fastify({ logger: { level: "info" } });

    server.register(healthCheckRoute);

    return server;
}
