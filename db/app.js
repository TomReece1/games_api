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
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentToReviewId);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
  console.log("In the specific error handler with err.status: " + err.status);
  if (err.status) {
    console.log("There's an err.status so send an error response");
    res.status(err.status).send({ msg: err.errorMessage });
  } else {
    console.log("No err.status so go on to the SQL error handler");
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("In the SQL specific error handler with err.code: " + err.code);
  if (err.code) {
    console.log("There's an err.code so send an error response");
    res.status(404).send({ msg: "request does not exist" });
  } else {
    console.log("No err.code so go on to 500 handler");
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("In the 500 handler");
  // console.log(err);
  res.status(500).send({ msg: "something went wrong" });
});

module.exports = app;
