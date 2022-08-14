# Transcendence

## Introduction
The purpose of this project is to take the first steps into fullstack development.

Thanks to this website, users will interact with others using a nice user
interface, a chat, and real-time multiplayer Pong.

## Description
This web application is fully deployed with a docker-compose file that sets up a postgres db, a nestjs backend server and a frontend in Vue.js.
The application has a login system that allows users to register and login with the API of Ecole 42 Paris as well as a guest login that allows users to browse the application without being logged in, for users logged in it also has the option of adding 2FA to their account via a QR code.

All passwords in db are hashed with bcrypt. The application also has a chat system that allows users to chat with each other with multiple available commands giving an interface similar to IRC chat. The chat system is fully deployed with a socket.io server.

It is also fully protected from CSRF attacks by using a JWT token system and SQL injection prevention.

## Technologies
This application is fully deployed with Docker, Docker Compose.
Fully writen in Typescript, with the use of NestJS and Vue.js.

## Inside

![Home](../../../../Screenshot%202022-08-14%20at%2016.34.23.png)

![Profile](../../../../Screenshot%202022-08-14%20at%2016.34.44.png)

![Pong](../../../../Screenshot%202022-08-14%20at%2016.36.39.png)

![2FA](../../../../Screenshot%202022-08-14%20at%2016.38.12.png)

![Chat](../../../../Screenshot%202022-08-14%20at%2016.55.25.png)

![Console](../../../../Screenshot%202022-08-14%20at%2016.38.58.png)

## Usage

Can be run using `docker-compose up --build` or `docker-compose up`.
A .env file must be created in the root of the project with the following variables:

```
# BACKEND

## psql

POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_PORT=
POSTGRES_HOST=

## upload

FILES_DEST=


## TOKEN without 2auth

JWT_SECRET=
JWT_EXPIRATION_TIME=

TWO_FACTOR_AUTHENTICATION_APP_NAME=

## JWT

JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_TOKEN_EXPIRATION_TIME=

## 42 Authentification
CLIEND_ID_42=
CLIENT_SECRET_42=
CLIENT_REDIRECT_42=
CLIENT_STATE=

# FRONTEND

## AUTH42

VUE_APP_AUTH42=

# SQL

PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
```

