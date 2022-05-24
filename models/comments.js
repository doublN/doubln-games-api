const db = require("../db/connection")
const {selectJustReview} = require("./reviews")

exports.selectCommentsByReviewId = (req) =>{
    return db.query(
        `SELECT * FROM comments
        WHERE comments.review_id = $1`, [req.params.review_id]).then((comments) =>{
            //Check the review_id exists, comments result from query
            return Promise.all([selectJustReview(req), comments])
        }).then(([review, comments]) =>{
            //the review_id does exist
            if(comments.rows.length === 0){
                //no comments for that review_id
                return Promise.reject({status : 200, msg : "No comments for that review"})
            } else{
                //return comments
                return comments.rows;
            }
        })
}

exports.addCommentByReviewId = (req) =>{
    return db.query(
        `INSERT INTO comments(author, body, review_id)
        VALUES($1, $2, $3)
        RETURNING *`,[req.body.username, req.body.body, req.params.review_id]).then((comment) =>{
            return comment.rows[0];
        })
}

exports.removeCommentByCommentId = (req) =>{
    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`, [req.params.comment_id]
    ).then((comments) =>{
        if(comments.rows.length === 0){
            return Promise.reject({status: 404, msg : "Comment id does not exist"})
        }
    })
}

exports.updateCommentByCommentId = (req) =>{
    if(!req.body.inc_votes){
        return Promise.reject({status:400, msg:"Bad request: missing update property"})
    }

    return db.query(
        `UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`, [req.body.inc_votes, req.params.comment_id]
    ).then((comment) =>{
        if(comment.rows.length === 0){
            return Promise.reject({status:404, msg:"comment id does not exist"})
        } else {
            return comment.rows[0];
        }
    })
}