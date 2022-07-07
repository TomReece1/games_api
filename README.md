Link to hosted version:
https://tr-games-api.herokuapp.com/api

Summary
This is a server for board game reviews.
The server stores: - all reviews made for board games - all comments made on those reviews - information on the users that have made those reviews or made those comments - information on the category of each board game
The server can: - serve all the categories - serve a single requested review - update the votes on a single requested review - serve all the users - serve all the reviews - serve all the comments on a single requested review - add a comment to a single requested review

Instructions
Cloning
From this github repository, click the code button in the top right and copy the link.
In your terminal go to the folder you want to clone the repo and use command: git clone [copy the link].
Installing dependencies
In your terminal use command: npm install.
That will install all the dependecies and devDependencies required to use and test the server
Seed local databases
You will need to create two .env files in the root of your directory: `.env.test` and `.env.development`.
Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names).
Double check that these .env files are .gitignored.
To create the development and test databases locally use command npm run setup-dbs.
To seed the development database, use commands npm run seed.
The test database will be seeded whenever you run a test.
Running tests
To run all tests, use command npm t
To specify which tests you want to run, open app.test.js and add keywords .skip or .only to as many describe blocks and test blocks as you want.
e.g to run a single test: test.only("test description...")

Requirements
Node.js v18.1.0
Postgres v8.7.3
