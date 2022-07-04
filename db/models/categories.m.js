const connection = require("../connection");

exports.fetchCategories = () => {
  return connection
    .query(
      `
  SELECT * FROM categories;
  `
    )
    .then((results) => {
      return results.rows;
    });
};
