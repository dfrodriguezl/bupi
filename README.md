# BUPI INVIAS

Aplicativo de cargue de información predial para el grupo de registro y administración de bienes de uso público BUPI del INVIAS


## Installation


1. Install dependences

```bash
npm run i
```

2. Local deploy

first run the start local deploy for modify the web app which is deployed on port 9000
```bash
npm run start

```

then run the backend which is deployed on port 3000

```bash
npm run nodemon

```


## Usage

run the command for build front-end

```bash
npm run build

```

run the command for build back-end

```bash
npm run build_back

```

to create the project build in [pip](dist) folder

## docker

To deploy in docker run the next command.

```bash
docker-compose up -d --build

```

More info, in  Dockerfile and docker-compose.yml

## Database

This project uses PostgreSQL in docker container, please visit:

[kartoza/postgis](https://hub.docker.com/r/kartoza/postgis/)

and follow the guide for install in docker.

## Contributing

Diego Fernando Rodriguez Lamus

INVIAS-COLOMBIA

## License
Private Project
