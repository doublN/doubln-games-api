const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

//seed the test data
beforeEach(() => seed(testData));

//end connection to the database
afterAll(() => db.end());

describe("GET /api/users", () =>{
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

describe("GET /api/users/:username", () =>{
    test("status 200: responds with a username object belonging to username passed in", () =>{
        return request(app)
        .get("/api/users/bainesface")
        .expect(200)
        .then(({body}) =>{
            expect(body.user).toMatchObject({
                username:"bainesface",
                avatar_url:"https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                name: "sarah"
            })
        })
    })

    test("status 404: username does not exist", () =>{
        return request(app)
        .get("/api/users/doubl_n")
        .expect(404)
        .then(({body}) =>{
            expect(body.msg).toEqual("username does not exist")
        })
    })
})