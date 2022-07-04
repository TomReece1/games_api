const express = require("express");
const { getCategories } = require("./controllers/categories.c.js");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use("*", (req, res) => {
  console.log("in 404 handler");
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
  console.log("in 500 handler");
  res.status(500).send({ msg: "something went wrong" });
});

module.exports = app;
