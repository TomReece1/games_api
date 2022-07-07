const connection = require("../connection");
const fs = require("fs/promises");

exports.fetchApi = () => {
  console.log("model start");
  return fs
    .readFile(`${__dirname}/../../endpoints.json`, "utf-8")
    .then((result) => {
      console.log("result from readFile is in model");
      return result;
    });
};
