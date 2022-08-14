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

The videos on websockets by Brian Johnson were extremely helpful to get started with websocket using Nestjs. 
https://youtube.com/playlist?list=PLBHzlq7ILbsaL1sZxJIxrc4ofSPAMSTzr

## Inside

<img width="1440" alt="Home" src="https://user-images.githubusercontent.com/66217791/184543532-97d29af8-1540-422a-ac82-a52dd5620af9.png">

<img width="1440" alt="Profile" src="https://user-images.githubusercontent.com/66217791/184543558-db96eb88-bfbf-401d-8c27-36983de9be76.png">

<img width="1440" alt="Pong" src="https://user-images.githubusercontent.com/66217791/184543576-a7949cb6-95ee-4ca8-883c-58eab3c99411.png">

<img width="1440" alt="2FA" src="https://user-images.githubusercontent.com/66217791/184543591-e319c16c-20aa-4eb2-b3ed-ff7287cf83e6.png">

<img width="206" alt="Chat" src="https://user-images.githubusercontent.com/66217791/184543602-078992f1-3be8-4e1d-bf4a-f8eb68e44ff7.png">


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


This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
