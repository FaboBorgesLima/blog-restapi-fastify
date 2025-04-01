import { FastifyInstance } from "fastify";
import dataSource from "../dataSource";
import { User } from "../entities/User";
import {
    IndexUserSchema,
    IndexUserSchemaType,
} from "../Schemas/User/IndexUserSchema";
import {
    ShowUserSchema,
    ShowUserSchemaType,
} from "../Schemas/User/ShowUserSchema";
import {
    CreateUserSchema,
    CreateUserSchemaType,
} from "../Schemas/User/CreateUserSchema";
import {
    PublicUserSchema,
    PublicUserSchemaType,
} from "../Schemas/User/SerializedUserSchema";
import { Type } from "@sinclair/typebox";
import { UserSchema, UserSchemaType } from "../Schemas/User/UserSchema";
import {
    UpdateUserSchema,
    UpdateUserSchemaType,
} from "../Schemas/User/UpdateUserSchema";

export async function userRoutes(fastify: FastifyInstance): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    fastify.post<{
        Body: CreateUserSchemaType;
        200: UserSchemaType;
    }>(
        "/users",
        {
            schema: {
                body: CreateUserSchema,
                response: {
                    200: UserSchema,
                },
            },
        },
        async (req) =>
            (
                await userRepository.save(userRepository.create(req.body))
            ).toJSON()
    );

    fastify.get<{
        Querystring: IndexUserSchemaType;
        Response: {
            200: {
                users: PublicUserSchemaType;
            };
        };
    }>(
        "/users",
        {
            schema: {
                querystring: IndexUserSchema,
                response: {
                    200: Type.Object({
                        users: Type.Array(PublicUserSchema),
                    }),
                },
            },
        },
        async (req) => ({
            users: (
                await userRepository.find({
                    skip: req.query.page * req.query.size,
                    take: req.query.size,
                })
            ).map((user) => user.toPublicJSON()),
        })
    );

    fastify.get<{ Params: ShowUserSchemaType }>(
        "/users/:id",
        { schema: { params: ShowUserSchema } },
        async (req) => ({
            user: await userRepository.findOneByOrFail({
                id: req.params.id.toString(),
            }),
        })
    );

    fastify.put<{ Params: { id: string }; Body: UpdateUserSchemaType }>(
        "/users/:id",
        {
            schema: {
                params: Type.Object({
                    id: Type.String(),
                }),
                body: UpdateUserSchema,
            },
        },
        async (req) =>
            await userRepository.update({ id: req.params.id }, req.body)
    );

    fastify.delete<{ Params: { id: string } }>(
        "/users/:id",
        {
            schema: {
                params: Type.Object({ id: Type.String() }),
            },
        },
        async (req) => await userRepository.delete(req.params.id)
    );
}
