import { Repository } from "typeorm";
import { User } from "../entities/User";

export class AuthenticationService {
    public constructor(public userRepository: Repository<User>) {
        //
    }

    public async getTokenUser(authorization: string): Promise<User> {
        if (!authorization) {
            throw new Error("Authorization header is missing");
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            throw new Error("Token is missing");
        }

        const user = await this.userRepository.findOneOrFail({
            where: { token },
        });

        return user;
    }
}
