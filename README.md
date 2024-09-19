# Employee Management API

## Table of Contents
1. [Pulling the Repository](#pulling-the-repository)
2. [Running Docker](#running-docker)
3. [Accessing Swagger Documentation](#accessing-swagger-documentation)
4. [API Endpoints](#api-endpoints)


## Pulling the Repository
To pull the repository, run the following command in your terminal:

```bash
git clone https://github.com/AfdulRohmat/ssi-employee-management.git
cd https://github.com/AfdulRohmat/ssi-employee-management.git
```

## Running Docker
First, running the docker build to build an image
```bash
docker-compose up --build
```

Later, just run the docker compose
```bash
docker-compose up -d
```

Application will running with postgreSQL database inside docker

## Accessing Swagger Documentation
Once the application is running, you can access the Swagger documentation at the following URL:
```bash
http://localhost:3000/api-docs/
```

## API Endpoints
| Name                          | Method | URL                                  | Description                                   |
|-------------------------------|--------|--------------------------------------|-----------------------------------------------|
| Register User                 | POST   | `/api/v1/auth/register`             | Registers a new user                          |
| Get Data User                 | GET    | `/api/v1/users/info`                | Get data user that currently login
| Activate Account              | POST   | `/api/v1/auth/activate-account`     | Activates a user's account                    |
| User Login                    | POST   | `/api/v1/auth/login`                | Logs in a user and returns a JWT token       |
| Add Employee                  | POST   | `/api/v1/employees/add-employee`    | Adds a new employee                           |
| Get All Employees             | GET    | `/api/v1/employees/all-employees`   | Retrieves a list of all employees             |
| Get Employee by ID            | GET    | `/api/v1/employees/:id`             | Retrieves an employee by their ID             |
| Update Employee by ID         | PUT    | `/api/v1/employees/:id/update`      | Updates an employee's details                 |
| Soft Delete Employee by ID     | DELETE | `/api/v1/employees/:id/delete`      | Soft deletes an employee by their ID          |
| Import Employees from CSV     | POST   | `/api/v1/employees/import-csv`      | Imports employees from a CSV file             |
| Export Employees (per page)   | GET    | `/api/v1/employees/export-data/per-page` | Exports employees data in CSV or PDF format |
| Export All Employees          | GET    | `/api/v1/employees/export-data/all` | Exports all employees data in CSV or PDF format |





<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
