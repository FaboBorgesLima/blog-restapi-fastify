import { Static, Type } from "@sinclair/typebox";

export const ShowUserSchema = Type.Object({
    id: Type.String(),
});

export type ShowUserSchemaType = Static<typeof ShowUserSchema>;
