
# PhoenixRP API

This repository contains the source code for the proposed version 2 of the API of the now shut down gaming community PhoenixRP.
It was never finished, and also might be a bit of a mess since it was the first large TypeScript project I did, but I am quite happy with it.

The API is a RESTful API, built with TypeScript, Express and Knex.

### Setup

Setting up this project is a fairly simple task.
You can use docker-compose for both development and production, or you can set up the project manually.

Before installing anything, we need to clone the repository:
```git clone -b v2 https://github.com/SigJig/phx-api.git```

Once the repository has been cloned, we need to set up some environment variables:
* Copy the contents of `./database/api/api.sample-env` into a new file, `api.env`, in the same directory. Fill in the missing details.
* (Development only) Repeat the above for the `./database/arma` directory.
* Finally, in the project base directory, create a `.env.<environment>` file (`<environment>` being one of `development`, `test`, or `production`). Copy the contents of `.sample-env` into your newly created file, and fill in the blanks.

##### docker-compose

When developing the project, the `docker-compose.yml` and `docker-compose.dev.yml` files can be used.
`docker-compose.dev.yml` defines an additional service, `db_arma`, which is used as a mock database for Altis Life.
It also enables hot-reloading, using bind-mounted volumes.

Example: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build`

When deploying to production, the `docker-compose.prod.yml` file is used.

Example: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`

##### Manual setup

Make sure you are in the `./api` directory.

* Install dependencies: `(yarn|npm) install`.
* Run the project: `(yarn|npm) run run:<environment>` (`<environment>` being one of `development`, `test`, or `production`).

##### Database setup

Preferrably, you should be running your database inside docker containers. This makes database setup a lot easier.

To run migrations using `docker-compose`, simply run the following command:
```docker-compose ... run migrations_handler yarn run knex migrate:latest``` (where `...` is replaced by the compose files).

Running seeds follows a similar approach:
```docker-compose ... run migrations_handler yarn run knex seed:run```

###### Manual database setup

Should you choose to not use docker containers, there are is a couple prerequisites you need to have ready before running the migrations.
* Database driver installed on your machine.
* An empty database, with it's name and connection details specified in the `./database/<module>/<module>.env` file. (Module being either `api`, `arma`).

Once you have that ready, `cd` into the database directory, and run;
* `yarn run migrate:latest --knexfile knexfile.<module>.ts` to run migrations.
* `yarn run seed:run --knexfile knexfile.<module>.ts` to run seeds.
