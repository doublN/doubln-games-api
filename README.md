# Doubl_N Games API

https://doubl-n-games.herokuapp.com/api

## Project Summary
This project is a REST API for a database of board game reviews, made up of reviews, categories, comments, and users tables. It currently supports GET, POST, PATCH, and DELETE requests at a variety of endpoints. A 'table of contents' of available requests and endpoints can be seen at GET `/api` or at the link above. 

## Project Setup

### Cloning the project and installing dependencies
1. Clone the project using `git clone https://github.com/doublN/nc-games.git`
2. Run `npm install` in order to install dependencies.
3. Run `npm run setup-dbs` and `npm run seed` in order to create and seed the database locally.
4. Run `npm test` to run tests.

### Environment variables
Create a .env.development file and assign the development database to the `PGDATABASE` variable, and a .env.test file and assign the test database to the `PGDATABASE` variable to be able to connect to the development and test databases.

### Node.js and Postgres
Node.js version 17.7.2 and above and Postgres version 14.2 and above are required to run this project.