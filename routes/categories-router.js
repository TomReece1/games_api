const categoriesRouter = require("express").Router();
const { getCategories } = require("../db/controllers/categories.c");

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
