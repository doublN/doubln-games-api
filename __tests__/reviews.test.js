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
    test.only("status: 200 responds with a review object containing the appropriate properties based on the review id passed in", () =>{
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
                owner : 'mallionaire'
            })
            //test correct created_at date separately
            expect(new Date(body.review.created_at)).toEqual(new Date(1610964020514))
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
            expect(body.msg).toEqual("Bad request: invalid id")
        })
    })
})