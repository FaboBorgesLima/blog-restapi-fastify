import { Static, Type } from "@sinclair/typebox";

export const UpdateUserSchema = Type.Object({
    password: Type.String({ minLength: 6 }),
});

export type UpdateUserSchemaType = Static<typeof UpdateUserSchema>;
