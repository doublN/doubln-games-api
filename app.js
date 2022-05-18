const { application } = require("express");
const express = require ("express");

const {
    getCategories,
} = require("./controllers/categories");

const {
    getReviews,
    getReviewById,
    patchReview,
} = require("./controllers/reviews")

const {
    getUsers,
} = require("./controllers/users")

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/users", getUsers);

//called if route is not found
app.use("/*", (req, res, next) =>{
    res.status(404).send({msg : "Endpoint not found"})
    next();
})

//psql errors
app.use((err, req, res, next) =>{
    if(err.code === '22P02'){
        res.status(400).send({msg : "Bad request: invalid data type"})
    } else{
        next(err);
    }
})

//custom errors
app.use((err, req, res, next) =>{
    res.status(err.status).send({msg : err.msg})
    next(err);
})

//catch all error message
app.use((err, req, res, next) =>{
    res.status(500).send({msg : "Internal server error"})
})

module.exports = app;