import { DataSource } from "typeorm";
import { config } from "./config";

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    username: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    database: config.POSTGRES_DB,
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
});
