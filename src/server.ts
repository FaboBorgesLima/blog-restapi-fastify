import { app } from "./app";
import { config } from "./config";

const server = app();

server.listen({ port: config.PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        server.log.error(err);
        console.error(err);
        process.exit(1);
    }

    server.log.info(`Server listening at ${address}`);
});
