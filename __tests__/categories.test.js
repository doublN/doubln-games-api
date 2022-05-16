const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

//seed the test data
beforeEach(() => seed(testData));

//end connection to the database
afterAll(() => db.end());

describe("All endpoints", ()=>{
    test("status: 404, endpoint not found", () =>{
        return request(app)
        .get("/api/woops")
        .expect(404)
        .then (({body}) =>{
            expect(body.msg).toEqual("Endpoint not found");
        })
    })
})

describe("GET /API/categories", () =>{
    test("status 200: responds with array of category objects, containing slug and description properties", () =>{
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({body}) => {
            expect(body.categories).toBeInstanceOf(Array);
            expect(body.categories).toHaveLength(4);
            body.categories.forEach((category) =>{
                expect(category).toMatchObject({
                    slug : expect.any(String),
                    description : expect.any(String)
                })
            })

        })
    })
})