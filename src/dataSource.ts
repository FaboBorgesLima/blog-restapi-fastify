import { DataSource } from "typeorm";
import { config } from "./config";
import { UserCreate1742940238325 } from "./migrations/1742940238325-UserCreate";
import { User } from "./entities/User";

export default new DataSource({
    type: "postgres",
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    username: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    database: config.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: [UserCreate1742940238325],
});
