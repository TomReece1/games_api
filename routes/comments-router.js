const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../db/controllers/comments.c");

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
