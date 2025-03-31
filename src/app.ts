import fastify, { FastifyInstance } from "fastify";
import { healthCheckRoutes } from "./routes/healthCheckRoutes";
import { userRoutes } from "./routes/userRoutes";
import { dataSourcePlugin } from "./plugins/dataSourcePlugin";

export function app(): FastifyInstance {
    const server = fastify({ logger: true });

    server.register(dataSourcePlugin);

    server.register(healthCheckRoutes);

    server.register(userRoutes);

    return server;
}
