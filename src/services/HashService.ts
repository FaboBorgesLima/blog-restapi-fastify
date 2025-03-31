import { createHmac, Hmac } from "crypto";
import { config } from "../config";

export class HashService {
    public static make(str: string): string {
        const hmac = HashService.getHmac();

        hmac.update(str);

        return hmac.digest("base64url");
    }

    private static getHmac(): Hmac {
        return createHmac("sha256", config.KEY);
    }
}
