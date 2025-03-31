import { describe, it } from "node:test";
import { RandomTokenService } from "../../src/services/RandomTokenService";
import assert from "node:assert";

describe("RandomTokenService", () => {
    it("make", () => {
        assert.notEqual(RandomTokenService.make(), RandomTokenService.make());
        assert.equal(RandomTokenService.make().length, 43);
    });
});
