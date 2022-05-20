const express = require ("express");
const apiRouter = require("./routes/api-router")

const {
    getCategories,
} = require("./controllers/categories");


const {
    getUsers,
} = require("./controllers/users")

const { 
    getCommentsByReviewId,
    postCommentByReviewId,
    deleteCommentByCommentId
} = require("./controllers/comments");

const app = express();
app.use(express.json());

//api
app.use("/api", apiRouter)

//Categories
app.get("/api/categories", getCategories);

//Users
app.get("/api/users", getUsers);

//Comments
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId)
app.post("/api/reviews/:review_id/comments", postCommentByReviewId)
app.delete("/api/comments/:comment_id", deleteCommentByCommentId)

//called if route is not found
app.use("/*", (req, res, next) =>{
    res.status(404).send({msg : "Endpoint not found"})
    next();
})

//psql errors
app.use((err, req, res, next) =>{
    if(err.code === '22P02'){
        res.status(400).send({msg : "Bad request: invalid data type"})
    } else if(err.code === '23503'){
        res.status(404).send({msg : "Bad request: invalid data"})
    }else if(err.code == '23502'){
        res.status(400).send({msg : 'Bad request: missing data'})
    }else{
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