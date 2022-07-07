const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";
//if you've run tests, then ENV is test, else it's development

require("dotenv").config({
  //this takes our env.whatever and assigns PGDATABASE
  path: `${__dirname}/../.env.${ENV}`, //path looks at our env.whatever
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  //if you're not in test or dev && you're not able to get a database url from heroku
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

// if (!process.env.PGDATABASE) {
//   throw new Error("PGDATABASE not set");
// }
//get rid of this because when run through heroku, line
// require("dotenv").config({ doesn't happen because our env files are gitignored
//so skipped

//if we're in production then use config object
//to pass DATABASE_URL to the pool
//it's the equivalent of test/dev doing dotenv config to find our local database
const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

module.exports = new Pool(config);

//what's a connection?
// elephant is running a server locally
// to make requests to it we must connect
// the elephant lets people in through doors
// go from node and make a connection to psql (connection like making a phone call)
// pool so we have loads of doors
