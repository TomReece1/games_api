const connection = require("../connection");

exports.removeCommentById = (comment_id) => {
  if (isNaN(+comment_id)) {
    return Promise.reject({
      status: 400,
      errorMessage: `comment_id must be a number`,
    });
  }

  return connection
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING comment_id AS deleted;
  `,
      [comment_id]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          errorMessage: `comment number ${comment_id} does not exist`,
        });
      } else {
        return rows[0];
      }
    });
};

// To check if comment_id wasn't found, previously we let the query go through
// and said if row_count === 0
// Maybe we can still do that since we're returning the comment_id AS deleted
