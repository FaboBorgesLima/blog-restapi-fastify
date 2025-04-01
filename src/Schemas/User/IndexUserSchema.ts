import { Static, Type } from "@sinclair/typebox";

export const IndexUserSchema = Type.Object({
    size: Type.Number({ maximum: 50, minimum: 1 }),
    page: Type.Number({ minimum: 0 }),
});

export type IndexUserSchemaType = Static<typeof IndexUserSchema>;
