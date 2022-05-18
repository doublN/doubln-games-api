const { send } = require("express/lib/response");
const {
    selectReviews,
    selectReviewById,
    updateReview,
} = require("../models/reviews")

//***DELETE NEXT IF NOT NEEDED */
exports.getReviews = (req, res, next) =>{
    selectReviews().then((reviews) =>{
        res.status(200).send({reviews})
    })
}

exports.getReviewById = (req, res, next) =>{
    selectReviewById(req).then((review) =>{
        res.status(200).send({review});
    }).catch((err) =>{
        next(err);
    })
}

exports.patchReview = (req, res, next) =>{
    const {inc_votes} = req.body;

    updateReview(req, inc_votes).then((review) =>{
        res.status(200).send({review});
    }).catch((err) =>{
        next(err);
    })
}