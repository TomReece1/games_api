const app = require("../db/app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
// const sorted = require("jest-sorted");

beforeEach(() => seed(data));

afterAll(() => {
  return connection.end();
});

describe.only("app", () => {
  describe("GET /api/categories", () => {
    test("1. status:200 and returns an object with key categories and a value of an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          console.log(body.categories, "<<--body.categories");
          body.categories.forEach((category) =>
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            )
          );
        });
    });
  });
});
