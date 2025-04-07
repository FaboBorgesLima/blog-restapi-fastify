import { User } from "../entities/User";
import { PublicUserSchemaType } from "../Schemas/User/SerializedUserSchema";
import { UserSchemaType } from "../Schemas/User/UserSchema";

export class UserSerializer {
    public static toPublicJSON(user: User): PublicUserSchemaType {
        if (!user.id) {
            throw Error("needs id");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }

    public static toJSON(user: User): UserSchemaType {
        if (!user.id) {
            throw Error("needs id");
        }

        return {
            email: user.email,
            id: user.id,
            name: user.name,
            token: user.token,
        };
    }
}
