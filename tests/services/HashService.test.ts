import { describe, it } from "node:test";
import { HashService } from "../../src/services/HashService";
import assert from "node:assert";

describe("HashService", () => {
    it("make", () => {
        assert.equal(
            HashService.make("something"),
            HashService.make("something")
        );

        assert.equal(HashService.make("something").length, 43);
    });
});
