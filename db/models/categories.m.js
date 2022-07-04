const connection = require("../connection");

exports.fetchCategories = () => {
  // console.log("3. start model function fetchTreasures");

  return connection
    .query(
      `
  SELECT * FROM categories;
  `
    )
    .then((results) => {
      // console.log("4. model query on treasures complete");
      return results.rows;
    });
};
