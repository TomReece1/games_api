const app = require("../db/app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

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

  describe("Misspelled endpoints receive 404", () => {
    test("Misspelled endpoints receive 404", () => {
      return request(app)
        .get("/api/categoriez")
        .expect(404)
        .then(({ body }) => {
          console.log(body.msg, "<<--body.msg");
          expect(body.msg).toBe("Invalid Path");
        });
    });
  });
});
