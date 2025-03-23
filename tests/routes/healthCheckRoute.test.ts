import test from "node:test";
import { healthCheckRoute } from "../../src/routes/healthCheckRoute";
import fastify from "fastify";

test("healthCheckRoute", async (t) => {
    const instance = fastify();

    instance.register(healthCheckRoute);

    const res = await instance.inject({ method: "GET", path: "/health-check" });

    t.assert.equal(res.statusCode, 200);
});
