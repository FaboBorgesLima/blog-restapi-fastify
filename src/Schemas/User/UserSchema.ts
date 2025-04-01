import { Static, Type } from "@sinclair/typebox";

export const UserSchema = Type.Object({
    token: Type.String(),
    name: Type.String(),
    email: Type.String(),
    id: Type.String(),
});

export type UserSchemaType = Static<typeof UserSchema>;
