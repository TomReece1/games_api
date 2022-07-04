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
            if (body.categories.length > 0) {
              body.categories.forEach((category) =>
                expect(category).toEqual(
                  expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String),
                  })
                )
              );
            } else {
              expect(body.categories).toEqual([]);
            }
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
              comment_count: "0",
            });
            expect(isNaN(+review.comment_count)).toBe(false);
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

    describe("GET /api/reviews", () => {
      test("status:200 and returns an object with key reviews and a value of an array of review objects", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            if (body.reviews.length > 0) {
              body.reviews.forEach((review) => {
                expect(review).toEqual(
                  expect.objectContaining({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_body: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String),
                  })
                );
                expect(isNaN(+review.comment_count)).toBe(false);
              });
            } else {
              expect(body.reviews).toEqual([]);
            }
          });
      });
    });

    describe("PATCH /api/reviews/:review_id", () => {
      const goodReqBody = {
        inc_votes: 2,
      };
      const badReqBody1 = {
        inc_votes: "wrong_type",
      };
      const badReqBody2 = {
        wrong_var_name: 1,
      };
      test("status:200 when requested review_id and req body are valid", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send(goodReqBody)
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
              votes: 3,
            });
          });
      });

      test("status:404 when requested review_id is a number but doesn't exist", () => {
        return request(app)
          .patch("/api/reviews/999")
          .send(goodReqBody)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("review number 999 does not exist");
          });
      });

      test("status:400 when requested review_id is not of type number", () => {
        return request(app)
          .patch("/api/reviews/invalid")
          .send(goodReqBody)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("review_id must be a number");
          });
      });

      test("status:422 when request body has wrong type", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send(badReqBody1)
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "something wrong with the request information provided"
            );
          });
      });

      test("status:422 when request body has wrong var name", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send(badReqBody2)
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "something wrong with the request information provided"
            );
          });
      });
    });
  });

  describe("users", () => {
    describe("GET /api/users", () => {
      test("status:200 and returns an object with key users and a value of an array of user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            if (body.users.length > 0) {
              body.users.forEach((user) =>
                expect(user).toEqual(
                  expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String),
                  })
                )
              );
            } else {
              expect(body.users).toEqual([]);
            }
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
