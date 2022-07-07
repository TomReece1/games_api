const express = require("express");

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

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentToReviewId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api", getApi);

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
