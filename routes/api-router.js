const apiRouter = require("express").Router();
const reviewsRouter = require("./reviews-router")
const { getEndpoints } = require("../controllers/api")

apiRouter.get('/', getEndpoints);

apiRouter.use('/reviews', reviewsRouter)

module.exports = apiRouter;