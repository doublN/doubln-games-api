const {
    selectReviews,
    selectReviewById,
    updateReview,
} = require("../models/reviews")

exports.getReviews = (req, res, next) =>{
    const {sort_by, order, category} = req.query;
    selectReviews(sort_by, order, category).then((reviews) =>{
        res.status(200).send({reviews})
    }).catch((err) =>{
        next(err);
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
