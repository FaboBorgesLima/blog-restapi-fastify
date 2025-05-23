import fastify, { FastifyInstance } from "fastify";
import { healthCheckRoutes } from "./routes/healthCheckRoutes";
import { userRoutes } from "./routes/userRoutes";
import { dataSourcePlugin } from "./plugins/dataSourcePlugin";
import authenticationRoutes from "./routes/authenticationRoutes";

export function app(): FastifyInstance {
    const server = fastify();

    server.register(dataSourcePlugin);

    server.register(healthCheckRoutes);

    server.register(userRoutes);

    server.register(authenticationRoutes);

    return server;
}
