const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewId,
  postCommentToReviewId,
} = require("../db/controllers/reviews.c");

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.patch("/:review_id", patchReviewById);
reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);
reviewsRouter.post("/:review_id/comments", postCommentToReviewId);

module.exports = reviewsRouter;
