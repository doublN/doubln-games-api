const apiRouter = require("express").Router();
const reviewsRouter = require("./reviews-router");
const commentsRouter = require("./comments-router")
const { getEndpoints } = require("../controllers/api");

apiRouter.get('/', getEndpoints);

apiRouter.use('/reviews', reviewsRouter)

apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter;