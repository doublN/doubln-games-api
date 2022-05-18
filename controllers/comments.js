const {
    selectCommentsByReviewId
} = require("../models/comments")

exports.getCommentsByReviewId = (req, res, next) =>{
    selectCommentsByReviewId(req).then((comments) =>{
        res.status(200).send({comments});
    }).catch((err) =>{
        next(err);
    });
}