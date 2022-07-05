const {
  fetchReviewById,
  updateReviewById,
  fetchReviews,
  fetchCommentsByReviewId,
  checkReviewExists,
  insertCommentToReviewId,
} = require("../models/reviews.m");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewById(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  return Promise.all([
    fetchCommentsByReviewId(review_id),
    checkReviewExists(review_id),
  ])
    .then((results) => {
      res.status(200).send({ comments: results[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentToReviewId = (req, res, next) => {
  console.log("controller start");
  const { review_id } = req.params;
  const { username, body } = req.body;

  // return Promise.all([
  insertCommentToReviewId(body, review_id, username)
    // ,
    // checkReviewExists(review_id),
    // ])
    .then((comment) => {
      // console.log("both promises resolve");
      res.status(201).send({ comment });
    })
    .catch((err) => {
      // console.log(
      //   "one of the promises was rejected, err received from model is: " + err
      // );
      next(err);
    });
};
