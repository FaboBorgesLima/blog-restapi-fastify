import assert from "node:assert";
import { User } from "../../src/entities/User";
import { describe, it } from "node:test";

describe("user", async () => {
    const user = new User();
    const user2 = new User();

    user.id = "1";
    user2.id = "2";

    it("can delete", async () => {
        assert.ok(user.canDelete(user));
        assert.ok(!user.canDelete(user2));
    });

    it("can update", async () => {
        assert.ok(user.canUpdate(user));
        assert.ok(!user.canUpdate(user2));
    });
});
