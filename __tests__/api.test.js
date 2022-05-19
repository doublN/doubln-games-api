const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const fs = require("fs/promises");
const { hasUncaughtExceptionCaptureCallback } = require("process");

describe("GET /api", () =>{
    test("status 200: responds with a json object containing all the endpoints", () =>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) =>{
            Promise.all([fs.readFile("../endpoints.json", "utf-8"), body.endpoints]);
        }).then((file, endpoints) =>{
            expect(endpoints).toEqual(file);
        })
    })
})