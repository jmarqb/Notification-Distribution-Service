<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


## Table of Contents

1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Docker Stack](#docker-stack)
8. [Test](#test)
9. [API Documentation](#api-documentation)
10. [Contact & Follow](#contact-&-follow)


### General Info

***
**Notification Distribution Service API**

The **Notification Distribution Service API** is designed to receive, process, and deliver notifications 
through various channels, such as email or internal systems. 
This system can handle notifications both instantly and batched,
allowing for optimal flexibility and efficiency.

It is developed using **NestJS**, **MongoDB**, **Redis** and follows best practices for **RESTful API design**.

### Technologies

***
Core technologies and tools used in this project:

- **NestJS:** Progressive Node.js framework for building scalable server-side applications.
- **MongoDB & Mongoose:** NoSQL database with schema-based modeling.
- **Redis (ioredis):** In-memory data store for caching and messaging.
- **JWT & Passport:** Authentication and authorization with JSON Web Tokens.
- **Swagger:** API documentation and OpenAPI specification.
- **Scheduler (Nest Schedule + Cron):** Task scheduling and cron jobs.
- **Nodemailer + Mailgun:** Email notifications and distribution.
- **TypeScript:** Strongly typed JavaScript for scalable development.
- **Docker:** Containerization for consistent deployment.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)


### Prerequisites

***
Before you begin, ensure you have the following installed on your system:

- [Node.js (v20+)](https://nodejs.org/en/) – Required runtime.
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) – Package manager used for installing dependencies.
- [MongoDB](https://www.mongodb.com/try/download/community) – Required as the main database.
- [Redis](https://redis.io/download) – Used for caching and message brokering.
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/) – *(Optional)*, if you prefer to run the application in containers.

⚠️ **Note:** It is recommended to use **Docker** for local development to avoid manual installation and configuration of MongoDB and Redis.

## Installation

To install API, follow these steps:

```bash
$ git clone https://github.com/jmarqb/Notification-Distribution-Service.git
$ cd Notification-Distribution-Service
$ yarn install
```

## Configuration

* Copy the contents of env-example into a new .env file and update it with your Credentials for connection parameters.
* Remember, you must have a running instance of MongoDB (https://www.mongodb.com/try/download/community)
* Remember, you must have a running instance of Redis (https://redis.io/download)

## Running the Application

To run Notification-Distribution-Service API, use the following command:

```bash
$ yarn run build
$ yarn run start
```

This will start the server and the application will be available at http://localhost:<your_port>

For Example: `http://localhost:3000/api`

We recommend you visit the section [API Documentation](#api-documentation)

## Docker Stack

If you have Docker and Docker Compose installed, running the application becomes even easier. First, clone the
repository and navigate to the project directory:

```bash
$ git clone https://github.com/jmarqb/Notification-Distribution-Service.git
$ cd Notification-Distribution-Service
$ yarn install
```

**Important**

* Copy the contents of env-example into a new .env file and update it with your Credentials for connection parameters.

* Now, you can start the services by running:

```
docker-compose up --build
```

This will start the server and the API will be available at http://localhost:<your_port>

For Example: `http://localhost:3000/api`

## Test

To ensure everything runs smoothly, this project includes Unit tests using the tools Jest and
Supertest. To execute them, follow these steps:

Dependency Installation: Before running the tests, ensure you've installed all the project dependencies. If you haven't
done so yet, you can install them by executing the command `yarn install`.

Unit Tests: To run unit tests on controllers of the API, use the following command:

```bash
$ yarn run test
```

## API Documentation

For more detailed information about the workflow of the API , endpoints, responses and status codes, visit the API
documentation.

You can access the API documentation at `localhost:<port>/api`
For example, when running the server locally, it will be available at localhost:3000/api

---

## Contact & Follow

Thank you for checking out my project! If you have any questions, feedback or just want to connect, here's where you can
find me:

**GitHub**: [jmarqb](https://github.com/jmarqb)

Feel free to [open an issue](https://github.com/jmarqb/Notification-Distribution-Service/issues) or submit a PR if you find
any
bugs or have some suggestions for improvements.

© 2025 Jacmel Márquez. All rights reserved.