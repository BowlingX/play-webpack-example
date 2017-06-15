play-webpack-example
--------------------

[![CircleCI](https://img.shields.io/circleci/project/github/BowlingX/play-webpack-example.svg)](https://circleci.com/gh/BowlingX/play-webpack-example)


This Example demonstrates `play-webpack`

- Renders a react application on the server
- Uses GraphQL with `apollo-client` on the frontend and `sangria` on the backend to execute async calls.


## Run with docker

If you just want to know what it exactly does, try the docker container:

    docker run -p 9000:9000 bowlingx/play-webpack-example:0.1.0-SNAPSHOT -Dplay.http.secret.key=notSoSecret

## Install

### Requirements

- sbt
- Yarn and node >= 6

Backend and frontend are build separately. The Backend is an ordinary play project with some glue code to allow GraphQL query execution
on the JS Event-Loop that `play-webpack` creates.

The Frontend part is a webpack2 configured react project. It includes `flow` and `eslint` rules and validation.
Additionally I added react-router (no routes configured)
### Start

- `yarn install` to install all frontend dependencies
- `yarn run develop` to start the frontend compiler

- `sbt` and `run` to start the play project

### Hot-Reload

Hot reload on the frontend is available with `yarn run hot`.