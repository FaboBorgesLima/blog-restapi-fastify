import { Static, Type } from "@sinclair/typebox";

export const CreateUserSchema = Type.Object({
    name: Type.String({ maxLength: 255 }),
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 6 }),
});

export type CreateUserSchemaType = Static<typeof CreateUserSchema>;
