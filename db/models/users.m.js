const connection = require("../connection");

exports.fetchUsers = () => {
  return connection
    .query(
      `
  SELECT * FROM users;
  `
    )
    .then((results) => {
      return results.rows;
    });
};
