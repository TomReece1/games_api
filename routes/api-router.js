const apiRouter = require("express").Router();
const { getApi } = require("../db/controllers/api.c");
const usersRouter = require("./users-router");
const categoriesRouter = require("./categories-router");
const reviewsRouter = require("./reviews-router");
const commentsRouter = require("./comments-router");

//test comment

apiRouter.get("/", getApi);

apiRouter.use("/users", usersRouter);

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
