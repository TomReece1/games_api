const connection = require("../connection");

exports.fetchReviewById = (review_id) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      errorMessage: `review_id must be a number`,
    });
  }

  return connection
    .query(
      `
  SELECT * FROM reviews
  WHERE review_id = $1;
  `,
      [review_id]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          errorMessage: `review number ${review_id} does not exist`,
        });
      } else {
        return rows[0];
      }
    });
};

exports.updateReviewById = (review_id, inc_votes) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      errorMessage: "review_id must be a number",
    });
  }

  if (isNaN(+inc_votes)) {
    return Promise.reject({
      status: 422,
      errorMessage: "something wrong with the request information provided",
    });
  }

  return connection
    .query(
      `
  UPDATE reviews
  SET votes = votes + $2
  WHERE review_id = $1
  RETURNING *;
  `,
      [review_id, inc_votes]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          errorMessage: `review number ${review_id} does not exist`,
        });
      } else {
        return rows[0];
      }
    });
};
