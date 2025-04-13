import { FastifyInstance } from "fastify";
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
import { UserRepository } from "../repositories/UserRepository";
import { UserSerializer } from "../serializers/UserSerializer";
import { HashService } from "../services/HashService";
import { AuthenticationService } from "../services/AuthenticationService";

export async function userRoutes(fastify: FastifyInstance): Promise<void> {
    const authenticationService = new AuthenticationService(UserRepository);

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
            UserSerializer.toJSON(
                await UserRepository.save(UserRepository.create(req.body))
            )
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
                await UserRepository.find({
                    skip: req.query.page * req.query.size,
                    take: req.query.size,
                })
            ).map((user) => UserSerializer.toPublicJSON(user)),
        })
    );

    fastify.get<{ Params: ShowUserSchemaType }>(
        "/users/:id",
        { schema: { params: ShowUserSchema } },
        async (req) => ({
            user: UserSerializer.toPublicJSON(
                await UserRepository.findOneByOrFail({
                    id: req.params.id.toString(),
                })
            ),
        })
    );

    fastify.put<{
        Params: { id: string };
        Body: UpdateUserSchemaType;
        Headers: { authorization: string };
    }>(
        "/users/:id",
        {
            schema: {
                params: Type.Object({
                    id: Type.String(),
                }),
                body: UpdateUserSchema,
                headers: Type.Object({
                    authorization: Type.String(),
                }),
                response: {
                    200: Type.Object({
                        user: UserSchema,
                    }),
                },
            },
        },
        async (req, reply) => {
            const [user, requestUser] = await Promise.all([
                UserRepository.findOneByOrFail({
                    id: req.params.id,
                }),
                authenticationService.getTokenUser(req.headers.authorization),
            ]);

            if (!requestUser.canUpdate(user))
                return reply.status(403).send({
                    message: "You are not allowed to update this user",
                });

            user.password = HashService.make(req.body.password);
            user.generateRandomToken();

            await UserRepository.save(user);

            return {
                user: UserSerializer.toJSON(user),
            };
        }
    );

    fastify.delete<{
        Params: { id: string };
        Headers: { authorization: string };
    }>(
        "/users/:id",
        {
            schema: {
                params: Type.Object({ id: Type.String() }),
                headers: Type.Object({
                    authorization: Type.String(),
                }),
            },
        },
        async (req, reply) => {
            const [requestUser, user] = await Promise.all([
                authenticationService.getTokenUser(req.headers.authorization),
                UserRepository.findOneByOrFail({
                    id: req.params.id,
                }),
            ]);

            if (!requestUser.canUpdate(user))
                return reply.status(403).send({
                    message: "You are not allowed to delete this user",
                });

            await UserRepository.delete(req.params.id);
        }
    );
}
