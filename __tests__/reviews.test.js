const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

//seed the test data
beforeEach(() => seed(testData));

//end connection to the database
afterAll(() => db.end());

describe("GET /api/reviews/:review_id", () =>{
    test("status: 200 responds with a review object containing the appropriate properties based on the review id passed in, accounting for no comments associated with the review_id", () =>{
        return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then (({body}) =>{
            //match review coming in with equivalent from database
            expect(body.review).toMatchObject({
                review_id : 1,
                title : 'Agricola',
                review_body : 'Farmyard fun!',
                designer : 'Uwe Rosenberg',
                review_img_url : 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                votes : 1,
                category : 'euro game',
                owner : 'mallionaire',
                comment_count : 0
            })
            //test correct created_at date separately
            expect(new Date(body.review.created_at)).toEqual(new Date(1610964020514))
        })
    })

    test("status: 200 responds with a review object containing the new comment_count property", () =>{
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then (({body}) =>{
            //match review coming in with equivalent from database
            expect(body.review).toMatchObject({
                review_id : 2,
                title : 'Jenga',
                review_body : 'Fiddly fun for all the family',
                designer : 'Leslie Scott',
                review_img_url : 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                votes : 5,
                category : 'dexterity',
                owner : 'philippaclaire9',
                comment_count : 3
            })
            //test correct created_at date separately
            expect(new Date(body.review.created_at)).toEqual(new Date(1610964101251))
        })
    })

    test("status: 404 when passed a valid number but no review existing for the id", ()=>{
        return request(app)
        .get("/api/reviews/9999")
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toEqual("Review id does not exist")
        })
    })

    test("status: 400 when passed an invalid id data type" , ()=>{
        return request(app)
        .get("/api/reviews/twentytwo")
        .expect(400)
        .then(({body}) =>{
            expect(body.msg).toEqual("Bad request: invalid data type")
        })
    })
})

describe("PATCH /api/reviews/:review_id", () =>{
    test("status: 200 responds with the correct review object with the votes number correctly adjusted for a positive number", ()=>{
        const updateObj = {
            inc_votes : 5,
        }

        return request(app)
        .patch("/api/reviews/2")
        .send(updateObj)
        .expect(200)
        .then(({body}) =>{
            //match review coming in with equivalent from database
            expect(body.review).toMatchObject({
                review_id : 2,
                title : 'Jenga',
                review_body : 'Fiddly fun for all the family',
                designer : 'Leslie Scott',
                review_img_url : 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                votes : 10,
                category : 'dexterity',
                owner : 'philippaclaire9'
            })
            //test correct created_at date separately
            expect(new Date(body.review.created_at)).toEqual(new Date(1610964101251))
        })
    })

    test("status: 200 responds with the correct review object with the votes number correctly adjusted for a negative number", ()=>{
        const updateObj = {
            inc_votes : -5,
        }

        return request(app)
        .patch("/api/reviews/2")
        .send(updateObj)
        .expect(200)
        .then(({body}) =>{
            //match review coming in with equivalent from database
            expect(body.review).toMatchObject({
                review_id : 2,
                title : 'Jenga',
                review_body : 'Fiddly fun for all the family',
                designer : 'Leslie Scott',
                review_img_url : 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                votes : 0,
                category : 'dexterity',
                owner : 'philippaclaire9'
            })
            //test correct created_at date separately
            expect(new Date(body.review.created_at)).toEqual(new Date(1610964101251))
        })
    })

    test("status: 404 when passed a valid number but no review existing for the id", ()=>{
        const updateObj = {
            inc_votes : 5,
        }

        return request(app)
        .patch("/api/reviews/9999")
        .send(updateObj)
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toEqual("Review id does not exist")
        })
    })

    test("status: 400 when passed an invalid id data type" , ()=>{
        const updateObj = {
            inc_votes : 5,
        }

        return request(app)
        .patch("/api/reviews/twentytwo")
        .send(updateObj)
        .expect(400)
        .then(({body}) =>{
            expect(body.msg).toEqual("Bad request: invalid data type")
        })
    })

    test("status: 400 when passed an invalid id data type in the update object" , ()=>{
        const updateObj = {
            inc_votes : "five",
        }

        return request(app)
        .patch("/api/reviews/2")
        .send(updateObj)
        .expect(400)
        .then(({body}) =>{
            expect(body.msg).toEqual("Bad request: invalid data type")
        })
    })

    test("status: 400 respond with an error message for missing inc_votes key", () =>{
        const updateObj = {};

        return request(app)
        .patch("/api/reviews/2")
        .send(updateObj)
        .expect(400)
        .then(({body}) =>{
            expect(body.msg).toEqual("Bad request: missing update property");
        })
    })
})