import { Static, Type } from "@sinclair/typebox";

export const PublicUserSchema = Type.Object({
    id: Type.String(),
    name: Type.String(),
    email: Type.String(),
});

export type PublicUserSchemaType = Static<typeof PublicUserSchema>;
