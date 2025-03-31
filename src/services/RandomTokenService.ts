import { randomBytes } from "node:crypto";

export class RandomTokenService {
    /**
     *
     * @returns
     */
    public static make(): string {
        return randomBytes(32).toString("base64url");
    }
}
