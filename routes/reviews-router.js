const reviewsRouter = require("express").Router();
const {
    getReviews,
    getReviewById,
    patchReview,
} = require("../controllers/reviews")

reviewsRouter.get("/", getReviews)

reviewsRouter.route("/:review_id")
.get(getReviewById)
.patch(patchReview)

module.exports = reviewsRouter;