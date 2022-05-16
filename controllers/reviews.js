const {
    selectReview,
    updateReview,
} = require("../models/reviews")

exports.getReview = (req, res, next) =>{
    selectReview(req).then((review) =>{
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
        console.log(err);
        next(err);
    })
}