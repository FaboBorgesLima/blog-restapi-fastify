import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Type, Static } from "@sinclair/typebox";
import { AuthenticationService } from "../services/AuthenticationService";
import { UserRepository } from "../repositories/UserRepository";
import { HashService } from "../services/HashService";
import { dataSourcePlugin } from "../plugins/dataSourcePlugin";

export async function authenticationRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    // Register the data source plugin
    fastify.register(dataSourcePlugin);

    // Authentication service instance
    const authenticationService = new AuthenticationService(UserRepository);

    // Schema for login route
    const LoginSchema = Type.Object({
        email: Type.String({ format: "email" }),
        password: Type.String({ minLength: 6 }),
    });

    const LoginResponseSchema = Type.Object({
        token: Type.String(),
    });

    const LoginErrorResponseSchema = Type.Object({
        error: Type.String(),
    });

    // Schema for logout route
    const LogoutSchema = Type.Object({
        authentication: Type.String(),
    });

    const LogoutResponseSchema = Type.Object({
        message: Type.String(),
    });

    const LogoutErrorResponseSchema = Type.Object({
        error: Type.String(),
    });

    // Route for user login
    fastify.post(
        "/login",
        {
            schema: {
                body: LoginSchema,
                response: {
                    200: LoginResponseSchema,
                    401: LoginErrorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const { email, password } = request.body as Static<
                typeof LoginSchema
            >;

            try {
                const user = await UserRepository.findOneOrFail({
                    where: { email, password: HashService.make(password) },
                });

                return reply.send({
                    message: "User logged in successfully",
                    token: user.token,
                });
            } catch (error) {
                return reply.status(401).send({ error: "Invalid credentials" });
            }
        }
    );

    // Route for user logout
    fastify.post(
        "/logout",
        {
            schema: {
                response: {
                    200: LogoutResponseSchema,
                    400: LogoutErrorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const { authentication } = request.headers as Static<
                typeof LogoutSchema
            >;

            try {
                const user = await authenticationService.getTokenUser(
                    authentication
                );

                user.generateRandomToken();

                await UserRepository.save(user);

                return reply.send({ message: "User logged out successfully" });
            } catch (error: any) {
                console.debug(error);
                return reply.status(400).send({ error: "Logout failed" });
            }
        }
    );

    // Route for token validation
    fastify.get<{
        Headers: {
            authentication: string;
        };
        Response: {
            valid: boolean;
        };
    }>(
        "/check-token",
        {
            schema: {
                headers: Type.Object({
                    authentication: Type.String(),
                }),
                response: {
                    200: Type.Object({
                        valid: Type.Boolean(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { authentication } = request.headers;

            try {
                const user = await authenticationService.getTokenUser(
                    authentication
                );

                return reply.send({ valid: !!user });
            } catch (error) {
                return reply.status(400).send({ valid: false });
            }
        }
    );
}

export default authenticationRoutes;
