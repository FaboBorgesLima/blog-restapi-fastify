import { FastifyInstance } from "fastify";
import dataSource from "../dataSource";

export async function dataSourcePlugin(fastify: FastifyInstance, options: {}) {
    if (!dataSource.isInitialized) {
        fastify.log.info("initializing dataSource ...");
        await dataSource.initialize();
        fastify.log.info("dataSource ready");

        fastify.decorate("dataSource", dataSource);

        fastify.addHook("onClose", (instance, done) => {
            // Accessing the extended property
            dataSource
                .destroy()
                .then(() => {
                    fastify.log.info("dataSource destroyed");
                    done();
                })
                .catch(done);
        });
    }
}
