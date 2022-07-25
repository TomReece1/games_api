const express = require("express");
const cors = require("cors");

const { getCategories } = require("./controllers/categories.c.js");
const {
  getReviewById,
  patchReviewById,
  getReviews,
  getCommentsByReviewId,
  postCommentToReviewId,
} = require("./controllers/reviews.c.js");
const { getUsers } = require("./controllers/users.c.js");
const { deleteCommentById } = require("./controllers/comments.c.js");
const { getApi } = require("./controllers/api.c.js");
const app = express();

const apiRouter = require("../routes/api-router");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.errorMessage });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(404).send({ msg: "request does not exist" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("In the 500 handler");
  console.log(err);
  res.status(500).send({ msg: "something went wrong" });
});

module.exports = app;
