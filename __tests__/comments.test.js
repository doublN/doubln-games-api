const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

//seed the test data
beforeEach(() => seed(testData));

//end connection to the database
afterAll(() => db.end());

describe("GET /api/reviews/:review_id/comments", () =>{
    test("status 200: responds with an array of comments based on the review_id passed in", () =>{
        return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({body}) =>{
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments).toHaveLength(3);
            body.comments.forEach((comment) =>{
                expect(comment).toMatchObject({
                    comment_id : expect.any(Number),
                    votes : expect.any(Number),
                    created_at : expect.any(String),
                    author : expect.any(String),
                    body : expect.any(String),
                    review_id : expect.any(Number),
                })
            })
        })
    })

    test("status 404: review_id does not exist", () =>{
        return request(app)
        .get("/api/reviews/9999/comments")
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toEqual("Review id does not exist")
        })
    })

    test("status 400: invalid data type passed in", () =>{
        return request(app)
        .get("/api/reviews/twentytwo/comments")
        .expect(400)
        .then(({body}) =>{
            expect(body.msg).toEqual("Bad request: invalid data type")
        })
    })

    test("status 200: review exsists but no comments to show", () =>{
        return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({body}) =>{
            expect(body.msg).toEqual("No comments for that review");
        })
    })
})