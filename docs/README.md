# Dev dependencies

-   docker 28

## Quick start

-   for starting the server run:

```shell
docker compose up
```

-   running migrations:

```shell
docker compose run --rm node npm run typeorm migration:run -- -d src/dataSource.ts
```

-   for runnig tests:

```shell
docker compose run --rm node npm test
```
