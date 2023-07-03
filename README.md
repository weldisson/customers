<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


  <p align="center">Visit <a href="https://customers-iota.vercel.app" target="_blank">Customers api</a> and make your customers in production.
    <p align="center">

</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Customers-api](https://customers-iota.vercel.app) performant and secure registration for customers!

## Installation

```bash
$ npm install
```

## enviroments config

make a file .env with content
```bash
SSO_URL=https://accounts.seguros.vitta.com.br
GRANT_TYPE=client_credentials
CLIENT_ID=customers 
CLIENT_SECRET=453000f7-47a0-4489-bc47-891c742650e2
SCOPE=openid
SECRET=MySecret@2023
REDIS_HOST=redis
REDIS_PASSWORD=myP@ss@2023
REDIS_PORT=6379
PORT=3000

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Running the app with docker compose

```bash
$ docker compose up
```
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Weldisson Araujo](https://github.com/weldisson)
- Website - [https://customers-iota.vercel.app](https://customers-iota.vercel.app)

## License

Nest is [MIT licensed](LICENSE).
