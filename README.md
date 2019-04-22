# Digital Signature
This is a MERN biolerplate with pages and signing.
The design of the codes follows the modern Javascript and React writing style.
With module-based design, the hierarchy of the code-base itself is also a template for writing MERN projects.

This is a boilerplate project using the following technologies:
- [Mongoose](http://mongoosejs.com/) for the database
- [Express](http://expressjs.com/)
- [React 16](https://facebook.github.io/react/), [React Router](https://reacttraining.com/react-router/) for the frontend, and [Redux](https://redux.js.org/) for global store
- [Node.js](https://nodejs.org/en/) for hosting server
- [Webpack4](https://webpack.github.io/) for compilation
- [JWT](https://jwt.io) for user session managemet

## Requirements
- [Node.js](https://nodejs.org/en/) 8+
- [MongoDB](https://www.mongodb.com/)

## Preparation
- Install required packages with `npm or yarn install`.
- Copy the example config file `server/config.example.js` to `server/config.js` and modify the content.
- Create a folder for database `mkdir ./db`.

## Running
1. Database daemon: `mongod -dbpath ./db`.
2. Node server:

Production mode:

```shell
npm run start
```

Development mode:

```shell
npm run start:dev
```
