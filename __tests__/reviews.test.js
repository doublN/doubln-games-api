const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

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

describe("GET /api/reviews", () =>{
    test("status 200: responds with an array of review object in descending order by date by default", () =>{
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews).toBeInstanceOf(Array);
            expect(body.reviews).toHaveLength(13);
            expect(body.reviews).toBeSortedBy("created_at", {descending : true});
            body.reviews.forEach((review) =>{
                expect(review).toMatchObject({
                    owner : expect.any(String),
                    title : expect.any(String),
                    review_id : expect.any(Number),
                    category : expect.any(String),
                    review_img_url : expect.any(String),
                    created_at : expect.any(String),
                    votes : expect.any(Number),
                    comment_count : expect.any(Number)
                })
            })
        })
    })

    test("status 200: results sorted by title descending", () =>{
        return request(app)
        .get("/api/reviews?sort_by=title")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews).toBeSortedBy("title", {descending : true})
        })
    })

    test("status 200: results sorted by category descending", () =>{
        return request(app)
        .get("/api/reviews?sort_by=category")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews).toBeSortedBy("category", {descending : true})
        })
    })

    test("status 200: results sorted by designer descending", () =>{
        return request(app)
        .get("/api/reviews?sort_by=designer")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews).toBeSortedBy("designer", {descending : true})
        })
    })

    test("status 200: results sorted by owner descending", () =>{
        return request(app)
        .get("/api/reviews?sort_by=owner")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews).toBeSortedBy("owner", {descending : true})
        })
    })

    test("status 200: results sorted by votes descending", () =>{
        return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews).toBeSortedBy("votes", {descending : true})
        })
    })

    test("status 200: results sorted by comment_count descending", () =>{
        return request(app)
        .get("/api/reviews?sort_by=comment_count")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews).toBeSortedBy("comment_count", {descending : true})
        })
    })

    test("status 200: results arrive in ascending order", () =>{
        return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews).toBeSortedBy("created_at")
        })
    })

    test("status 200: results filtered by a category", () =>{
        return request(app)
        .get("/api/reviews?category=social deduction")
        .expect(200)
        .then(({body}) =>{
            expect(body.reviews).toHaveLength(11);
            body.reviews.forEach((review) =>{
                expect(review.category).toEqual('social deduction');
            })
        })
    })

    test("status 400: when passed an invalid sort_by query", ()=>{
        return request(app)
        .get("/api/reviews?sort_by=melon")
        .expect(400)
        .then(({body}) =>{
            expect(body.msg).toEqual("Invalid sort query")
        })
    })

    test("status 400: when passed a invalid order_by query" ,() =>{
        return request(app)
        .get("/api/reviews?order=bananas")
        .expect(400)
        .then(({body}) =>{
            expect(body.msg).toEqual("Invalid order query")
        })
    })

    test("status 404: when passed a non-exsistant category", ()=>{
        return request(app)
        .get("/api/reviews?category=NotACategory")
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toEqual("Invalid query")
        })
    })
})