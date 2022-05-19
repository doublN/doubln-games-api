const {
    selectCommentsByReviewId, 
    addCommentByReviewId,
    removeCommentByCommentId,
} = require("../models/comments")

exports.getCommentsByReviewId = (req, res, next) =>{
    selectCommentsByReviewId(req).then((comments) =>{
        res.status(200).send({comments});
    }).catch((err) =>{
        next(err);
    });
}

exports.postCommentByReviewId = (req, res, next) =>{
    addCommentByReviewId(req).then((comment) =>{
        res.status(201).send({comment});
    }).catch((err) =>{
        next(err);
    })
}

exports.deleteCommentByCommentId = (req, res, next) =>{
    removeCommentByCommentId(req).then(() =>{
        res.status(204).send();
    }).catch((err) =>{
        next(err);
    })
}