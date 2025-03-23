export const config = getConfig();

interface Config {
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_PASSWORD: string;
    POSTGRES_USER: string;
    POSTGRES_DB: string;
    PORT: number;
}

function getConfig(): Config {
    return {
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? "",
        POSTGRES_HOST: process.env.POSTGRES_HOST ?? "localhost",
        POSTGRES_PORT: process.env.POSTGRES_PORT
            ? parseInt(process.env.POSTGRES_PORT)
            : 5432,
        POSTGRES_USER: process.env.POSTGRES_USER ?? "",
        POSTGRES_DB: process.env.POSTGRES_DB ?? "",
        PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    };
}
