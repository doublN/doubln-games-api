const reviewsRouter = require("express").Router();
const {
    getReviews,
    getReviewById,
    patchReview,
} = require("../controllers/reviews")

const { 
    getCommentsByReviewId,
    postCommentByReviewId,
} = require("../controllers/comments");

reviewsRouter.get("/", getReviews)

reviewsRouter.route("/:review_id")
.get(getReviewById)
.patch(patchReview)

reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);

reviewsRouter.post("/:review_id/comments", postCommentByReviewId);

module.exports = reviewsRouter;