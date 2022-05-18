const db = require("../db/connection")
const {selectReviewById} = require("./reviews")

exports.selectCommentsByReviewId = (req) =>{
    return db.query(
        `SELECT * FROM comments
        WHERE comments.review_id = $1`, [req.params.review_id]).then((comments) =>{
            //Check the review_id exists, comments result from query
            return Promise.all([selectReviewById(req), comments])
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