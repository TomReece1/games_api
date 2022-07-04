const express = require("express");

const { getCategories } = require("./controllers/categories.c.js");
const {
  getReviewById,
  patchReviewById,
} = require("./controllers/reviews.c.js");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.patch("/api/reviews/:review_id", patchReviewById);

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
  res.status(500).send({ msg: "something went wrong" });
});

module.exports = app;
