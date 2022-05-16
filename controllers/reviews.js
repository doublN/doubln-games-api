const {
    selectReview
} = require("../models/reviews")

exports.getReview = (req, res, next) =>{
    selectReview(req).then((review) =>{
        res.status(200).send({review});
    }).catch((err) =>{
        next(err);
    })
}