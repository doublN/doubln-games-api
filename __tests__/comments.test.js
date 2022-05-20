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

describe("POST /api/reviews/:review_id/comments", () =>{
    test("status: 201 adds comment object to comments table and responds with the posted comment", () =>{
        const commentObj = {
            username : "mallionaire",
            body : "Fantastic!"
        }

        return request(app)
        .post("/api/reviews/3/comments")
        .send(commentObj)
        .expect(201)
        .then(({body : {comment}}) =>{
            expect(comment).toMatchObject({
                comment_id : 7,
                body : "Fantastic!",
                review_id : 3, 
                author : "mallionaire",
                votes : 0,
            })

            //check date up to the second
            const dateNow = new Date(Date.now());
            const commentDate = new Date(comment.created_at);

            dateNow.setMilliseconds(0);
            commentDate.setMilliseconds(0);

            expect(commentDate).toEqual(dateNow);
        })
    })

    test("status: 404 review_id does not exist", () =>{
        const commentObj = {
            username : "mallionaire",
            body : "Fantastic!"
        }

        return request(app)
        .post("/api/reviews/9999/comments")
        .send(commentObj)
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toEqual("Bad request: invalid data")
        })
    })

    test("status: 400 when passed an object with missing keys" , ()=>{
        const commentObj = {}

        return request(app)
        .post("/api/reviews/3/comments")
        .send(commentObj)
        .expect(400)
        .then(({body}) =>{
            expect(body.msg).toEqual("Bad request: missing data")
        })
    })

    test("status: 404 when passed an object with a user that doesn't exist" , ()=>{
        const commentObj = {
            username : "doubl_n",
            body : "Fantastic!"
        }

        return request(app)
        .post("/api/reviews/3/comments")
        .send(commentObj)
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toEqual("Bad request: invalid data")
        })
    })
})

describe("DELETE /api/comments/:comment_id", () =>{
    test("status: 204 responds with no content upon successfully deleting comment", () =>{
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({body}) =>{
            expect(body).toEqual({});

            return db.query(`SELECT * FROM comments`)
        }).then((comments) =>{
            expect(comments.rows).toHaveLength(5);
            const expected = {comment_id : 1}
            
            comments.rows.forEach((comment) =>{
                expect(comment).not.objectContaining(expected);
            })
        })
    })

    test("status: 404 when the comment_id doesn't exist", ()=>{
        return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toEqual("Comment id does not exist")
        })
    })

    test.only("status: 400 when the passed comment_id is of incorrect type", () =>{
        return request(app)
        .delete("/api/comments/eleventy")
        .expect(400)
        .then(({body}) =>{
            expect(body.msg).toEqual("Bad request: invalid data type")
        })
    })
})