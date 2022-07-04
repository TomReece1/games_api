const app = require("../db/app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

afterAll(() => {
  return connection.end();
});

describe("app", () => {
  describe("categories", () => {
    describe("GET /api/categories", () => {
      test("status:200 and returns an object with key categories and a value of an array of category objects", () => {
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
  });

  describe("reviews", () => {
    describe("GET /api/reviews/:review_id", () => {
      test("status:200 and returns an object with key review and a value of a review object with corresponding review_id", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({ body: { review } }) => {
            expect(review).toEqual({
              review_id: 1,
              title: "Agricola",
              category: "euro game",
              designer: "Uwe Rosenberg",
              owner: "mallionaire",
              review_body: "Farmyard fun!",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              created_at: "2021-01-18T10:00:20.514Z",
              votes: 1,
            });
          });
      });

      test("status:404 when requested review_id is a number but doesn't exist", () => {
        return request(app)
          .get("/api/reviews/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("review number 999 does not exist");
          });
      });

      test("status:400 when requested review_id is not of type number", () => {
        return request(app)
          .get("/api/reviews/invalid")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("review_id must be a number");
          });
      });
    });
  });

  describe("General error handling", () => {
    test("Misspelled endpoints receive 404", () => {
      return request(app)
        .get("/api/categoriez")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Path");
        });
    });
  });
});
