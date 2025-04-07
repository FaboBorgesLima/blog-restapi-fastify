import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Type, Static } from "@sinclair/typebox";
import { AuthenticationService } from "../services/AuthenticationService";
import { UserRepository } from "../repositories/UserRepository";
import { HashService } from "../services/HashService";

async function authenticationRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
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
        auhthentication: Type.String(),
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
                body: LogoutSchema,
                response: {
                    200: LogoutResponseSchema,
                    400: LogoutErrorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const { auhthentication } = request.headers as Static<
                typeof LogoutSchema
            >;

            try {
                const user = await authenticationService.getTokenUser(
                    auhthentication
                );

                user.generateRandomToken();

                UserRepository.save(user);

                return reply.send({ message: "User logged out successfully" });
            } catch (error) {
                return reply.status(400).send({ error: "Logout failed" });
            }
        }
    );
}

export default authenticationRoutes;
