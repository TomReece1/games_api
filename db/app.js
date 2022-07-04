const express = require("express");
// const connection = require("./connection");
const { getCategories } = require("./controllers/categories.c.js");
const app = express();

app.use(express.json());

// console.log("1. start of app");

// Responds with:

// an array of category objects, each of which should have the following properties:
// slug
// description

app.get("/api/categories", getCategories);

module.exports = app;
