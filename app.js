const express = require ("express");

const {
    getCategories,
} = require("./controllers/categories");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

//called if route is not found
app.use("/*", (req, res, next) =>{
    res.status(404).send({msg : "Endpoint not found"})
    next();
})

//catch all error message
app.use((err, req, res, next) =>{
    console.log(err);
    res.status(500).send({msg : "Internal server error"})
})

module.exports = app;