const { fetchCategories } = require("../models/categories.m");

exports.getCategories = (req, res, next) => {
  // console.log("2. start controller function getTreasures");

  fetchCategories()
    .then((categories) => {
      // console.log("5. controller has a response ready to send");
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};
