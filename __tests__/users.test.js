const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

//seed the test data
beforeEach(() => seed(testData));

//end connection to the database
afterAll(() => db.end());

describe.only("GET /api/users", () =>{
    test("status 200: responds with array of user objects, containing username, name, and avatar_url properties", () =>{
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            expect(body.users).toBeInstanceOf(Array);
            expect(body.users).toHaveLength(4);
            body.users.forEach((user) =>{
                expect(user).toMatchObject({
                    username : expect.any(String),
                    name : expect.any(String),
                    avatar_url : expect.any(String)
                })
            })
        })
    })
})