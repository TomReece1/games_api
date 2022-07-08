const usersRouter = require("express").Router();
const { getUsers } = require("../db/controllers/users.c");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
