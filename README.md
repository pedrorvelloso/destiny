# Destiny

Destiny is a donation tracker for speedruns/gaming charity events.

## Development

To start developing install dependencies, start DB docker and set environment variables

```sh
# install dependencies
yarn

# start docker db
docker-compose up db

# set env file
cp .env.example .env
```

Then start development server

```sh
yarn start:dev

# if you want to run with debug
yarn start:dev:debug
```

If it's all good you should see the following output
```sh
🚀 Listening on port 3333
🔉 Listening Streamlabs
```

Server now should be listening at `http://localhost:3333` (or .env port you set)

## Tests

All server Services should be tested. To run tests run `yarn test`

## Deploy

You can build everything with `yarn build` and deploy wherever you want

### Docker

If you want to use Docker you can build the `Dockerfile` or run `docker-compose.yml`.

```sh
# running with docker-compose.yml
docker-compose build app

docker-compose up -d # this will also start db service :)
```

## Folder structure
```sh
.
+-- src
|   +-- @types # server types
|   +-- config # general configuration
|   +-- modules # server modules by domain
|       +-- donations [module] # donation module (or every other module)
|           +-- dtos # Data transfer objects interface definition
|           +-- infra # Any 3rd party implementation
|           +-- repositories # Interface daclaration for object repositories
|               +-- fakes # Fake repositories (test purpose)
|           +-- services # Buissness logic implementation
|   +-- shared # server shared modules by domain
|   +-- bootstrap.ts # server startup
```

