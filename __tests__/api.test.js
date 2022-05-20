const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const fs = require("fs/promises");

describe("GET /api", () =>{
    test("status 200: responds with a json object containing all the endpoints", () =>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({text}) =>{
            return Promise.all([fs.readFile("./endpoints.json", "utf-8"), text]);
        }).then(([file, text]) =>{
            expect(text).toEqual(file);
        })
    })
})