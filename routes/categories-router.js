const categoriesRouter = require("express").Router();
const{getCategories} = require("../controllers/categories")

categoriesRouter.get("/", getCategories)

module.exports = categoriesRouter;