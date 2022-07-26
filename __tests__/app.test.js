const app = require("../db/app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

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
      test("status:200 and returns an object with key reviews and a value of an array of review objects in descending date order", () => {
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
              expect(body.reviews).toBeSortedBy("created_at", {
                descending: true,
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

    describe("GET /api/reviews/:review_id/comments", () => {
      test("status:200 returns array of comment objects when passed a valid review_id with at least 1 comment", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(3);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  body: expect.any(String),
                  review_id: expect.any(Number),
                  author: expect.any(String),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                })
              );
            });
          });
      });
      test("status:200 returns an empty array when passed a valid review_id with 0 comments", () => {
        return request(app)
          .get("/api/reviews/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
          });
      });

      test("status:404 when requested review_id is a number but doesn't exist", () => {
        return request(app)
          .get("/api/reviews/999/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("review number 999 does not exist");
          });
      });

      test("status:400 when requested review_id is not of type number", () => {
        return request(app)
          .get("/api/reviews/invalid/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("review_id must be a number");
          });
      });
    });

    describe("POST /api/reviews/:review_id/comments", () => {
      const validReqBody = {
        username: "mallionaire",
        body: "Apt analysis, Robert",
      };
      const invalidReqBodyValueType = {
        username: 3,
        body: "Apt analysis, Robert",
      };
      const invalidReqBodyWrongKeys = {
        username: "mallionaire",
        text: "Apt analysis, Robert",
      };
      const invalidReqBodyMissingKey = {
        username: "mallionaire",
      };
      const invalidReqBodyUsername = {
        username: "tomreece1",
        body: "Apt analysis, Robert",
      };
      test("status:201 responds with the posted comment when review_id and req body are valid", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send(validReqBody)
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 7,
                body: "Apt analysis, Robert",
                review_id: 1,
                author: "mallionaire",
                votes: 0,
                created_at: expect.any(String),
              })
            );
          });
      });

      test("status:201 length of comments table becomes 1 more", () => {
        let startingComments = undefined;
        let finalComments = undefined;

        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            startingComments = comments.length;
            return request(app)
              .post("/api/reviews/2/comments")
              .send(validReqBody)
              .expect(201)
              .then(() => {
                return request(app)
                  .get("/api/reviews/2/comments")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    finalComments = comments.length;
                    expect(finalComments).toBe(startingComments + 1);
                  });
              });
          });
      });

      test("status:404 when review_id is a number that doesn't exist", () => {
        return request(app)
          .post("/api/reviews/999/comments")
          .send(validReqBody)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("request does not exist");
          });
      });

      test("status:400 when review_id is not of type number", () => {
        return request(app)
          .post("/api/reviews/invalid/comments")
          .send(validReqBody)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("review_id must be a number");
          });
      });

      test("status:422 when request body values are wrong type", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send(invalidReqBodyValueType)
          .expect(422)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "something wrong with the request information provided"
            );
          });
      });

      test("status:422 when request body keys are wrong strings", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send(invalidReqBodyWrongKeys)
          .expect(422)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "something wrong with the request information provided"
            );
          });
      });

      test("status:422 when request body is missing a key", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send(invalidReqBodyMissingKey)
          .expect(422)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "something wrong with the request information provided"
            );
          });
      });

      test("status:404 when request body has a username that is a string but isn't on users table", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send(invalidReqBodyUsername)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("request does not exist");
          });
      });
    });

    //Happy paths
    //sort_by any column (defualts to date)
    //order by asc/desc (defaults to desc)
    //category (filters only the category)
    //mix and match of multiple queries together
    //Sad Paths
    //sort by a string that isn't valid
    //order by a string that isn't valid
    //filter by a string that isn't valid
    describe("GET /api/reviews queries", () => {
      test("200 accepts sort_by query with any column, descending by default", () => {
        return request(app)
          .get("/api/reviews?sort_by=title")
          .expect(200)
          .then(({ body: { reviews } }) => {
            console.log(reviews);
            expect(reviews).toBeSortedBy("title", { descending: true });
          });
      });
      test.skip("200 accepts sort_by query with comment_count, descending by default", () => {
        return request(app)
          .get("/api/reviews?sort_by=comment_count")
          .expect(200)
          .then(({ body: { reviews } }) => {
            console.log(reviews);
            expect(reviews).toBeSortedBy("title", { descending: true });
          });
      });
      test("200 accepts sort_by query with another column, descending by default", () => {
        return request(app)
          .get("/api/reviews?sort_by=votes")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy("votes", { descending: true });
          });
      });
      test("200 accepts order asc", () => {
        return request(app)
          .get("/api/reviews?order=asc")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy("created_at");
          });
      });
      test("200 filters by category", () => {
        return request(app)
          .get("/api/reviews?category=dexterity")
          .expect(200)
          .then(({ body: { reviews } }) => {
            reviews.forEach((review) => {
              expect(review.category).toBe("dexterity");
            });
          });
      });
      test("200 all 3 queries together", () => {
        return request(app)
          .get("/api/reviews?sort_by=title&order=asc&category=social deduction")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy("title");
            reviews.forEach((review) => {
              expect(review.category).toBe("social deduction");
            });
          });
      });
      test("400 for an invalid sort_by query option", () => {
        return request(app)
          .get("/api/reviews?sort_by=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid sort_by query");
          });
      });
      test("400 for an invalid order query option", () => {
        return request(app)
          .get("/api/reviews?order=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid order query");
          });
      });

      test("404 for a category query option that doesn't exist", () => {
        return request(app)
          .get("/api/reviews?category=invalid")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("category invalid does not exist");
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

  describe("comments", () => {
    describe("DELETE /api/comments/:comment_id", () => {
      test("204 responds with no content", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(({ body }) => {
            expect(body).toEqual({});
          });
      });

      test("404 when passed an id that is a number but doesn't exist", () => {
        return request(app)
          .delete("/api/comments/9999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("comment number 9999 does not exist");
          });
      });

      test("400 when passed an id that is not of type number", () => {
        return request(app)
          .delete("/api/comments/invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("comment_id must be a number");
          });
      });
    });
  });

  describe("api", () => {
    describe("GET /api", () => {
      test("200 returns JSON describing available endpoints", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(typeof body).toBe("object");
            expect(body).toEqual(
              expect.objectContaining({
                "GET /api": expect.any(Object),
                "GET /api/categories": expect.any(Object),
                "GET /api/reviews/:review_id": expect.any(Object),
                "PATCH /api/reviews/:review_id": expect.any(Object),
                "GET /api/users": expect.any(Object),
                "GET /api/reviews": expect.any(Object),
                "GET /api/reviews/:review_id/comments": expect.any(Object),
                "POST /api/reviews/:review_id/comments": expect.any(Object),
                "DELETE /api/comments/:comment_id": expect.any(Object),
              })
            );
            for (const endpoint in body) {
              expect(body[endpoint]).toEqual(
                expect.objectContaining({
                  description: expect.any(String),
                })
              );
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
