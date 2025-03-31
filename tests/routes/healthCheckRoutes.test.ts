import test from "node:test";
import { healthCheckRoutes } from "../../src/routes/healthCheckRoutes";
import fastify from "fastify";

test("healthCheckRoutes", async (t) => {
    const instance = fastify();

    instance.register(healthCheckRoutes);

    const res = await instance.inject({ method: "GET", path: "/health-check" });

    t.assert.equal(res.statusCode, 200);
});
