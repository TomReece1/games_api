const { fetchApi } = require("../models/api.m");

exports.getApi = (req, res, next) => {
  console.log("controller start");
  fetchApi()
    .then((result) => {
      console.log("result was returned to controller");
      // console.log(result);
      // console.log(typeof JSON.parse(result));
      const parsedResult = JSON.parse(result);
      res.status(200).send(parsedResult);
    })
    .catch((err) => {
      next(err);
    });
};
