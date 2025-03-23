import test from "node:test";
import { app } from "../src/app";

test("app", async (t) => {
    const res = await app().inject({ url: "/health-check", method: "GET" });

    t.assert.equal(res.statusCode, 200, "status did not match");
});
