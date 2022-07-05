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
      SELECT reviews.*, count(comments.body) AS comment_count FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;
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

exports.fetchReviews = () => {
  return connection
    .query(
      `
      SELECT reviews.*, count(comments.body) AS comment_count FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id
      ORDER BY reviews.created_at desc;
  `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsByReviewId = (review_id) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      errorMessage: `review_id must be a number`,
    });
  }

  return connection
    .query(
      `
    SELECT * FROM comments
    WHERE review_id = $1;
  `,
      [review_id]
    )
    .then(({ rows, rowCount }) => {
      return rows;
    });
};

exports.insertCommentToReviewId = (body, review_id, username) => {
  console.log("model insertCommentToReviewId start");
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      errorMessage: `review_id must be a number`,
    });
  }
  if (typeof body !== "string" || typeof username !== "string") {
    return Promise.reject({
      status: 422,
      errorMessage: "something wrong with the request information provided",
    });
  }
  return connection
    .query(
      `
      INSERT INTO comments
      (body, review_id, author)
      VALUES
      ($1, $2, $3)
      RETURNING *;
      `,
      [body, review_id, username]
    )
    .then(({ rows }) => {
      console.log("model insertCommentToReviewId then block starts");
      // if (rowCount === 0) {
      //   return Promise.reject({
      //     status: 404,
      //     errorMessage: `review number ${review_id} does not exist`,
      //   });
      // } else {
      return rows[0];
      // }
    });
};

exports.checkReviewExists = (review_id) => {
  console.log("model checkReviewExists start");
  const queryStr = `
  SELECT * FROM reviews WHERE review_id = $1;
  `;
  if (!review_id) {
    return;
  }
  return connection.query(queryStr, [review_id]).then(({ rowCount }) => {
    if (rowCount === 0) {
      console.log(
        "model checkReviewExists found that review did not exist, return rejected promise"
      );
      return Promise.reject({
        status: 404,
        errorMessage: `review number ${review_id} does not exist`,
      });
    }
    return true;
  });
};
