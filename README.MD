![Lint&&Testing](https://github.com/BogdanMilivojevic/Hermes-chat-v2-BE/actions/workflows/pull.yml/badge.svg)

# Hermes-chat-v2-BE

Hermes-chat-v2-BE is a nodejs backend for a real-time messaging app, made with Express.js and Sequelize ORM
Hermes-chat-v2-FE or the client side can be found on Github: https://github.com/BogdanMilivojevic/Hermes-chat-v2-FE

Features:

- Websocket enables real-time messaging
- AWS's S3 enables image sharing between users
- CI-CD pipeline which makes test passing a requirement for a successful merge
- Authentication and Authorization
- Tests are made with jest

## Installation:

### Step 1

Clone the repository from GitHub: https://github.com/BogdanMilivojevic/Hermes-chat-v2-BE.git
You will need node v18.9.0, npm, docker and docker-compose installed on your machine.

All commands should be run inside of the container which can be accessed by running ./bin/container from the root

### Step 2

When inside the container, run the following npm commands:

to create a database

`$ npm db:create`

run migrations:

`$ npm db:migrate`

run seeders:

`$ npm db:seed`

### Step 3

The web app should be available at localhost:4000

## Testing

### Step 1

To run tests you should also run ./bin/container from the root in order to open the container

Set the NODE_ENV to test

### Step 2

Create database

`$ npm db:create`

Run migrations

`$ npm db:migrate`

### Step 3

Run tests

`$ npm test`

## Deployment

The app is deployed on Digital Ocean Droplet: https://hermes-chat.bogdanmilivojevic.com

Deploy is done automatically when merging into master.

## Naming conventions

Branches should be named as following: H-BE-13-Images, in this example BE stands for Backend and 13 is the number of the ticket on Trello and after that is a short description. Commit messages should also have this format.
