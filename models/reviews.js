const db = require("../db/connection");

exports.selectReviews = () =>{
    return db.query(`
    SELECT reviews.*, COUNT(reviews.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC`).then((reviews) =>{
        return reviews.rows;
    })
}

exports.selectReviewById = (req) =>{
    return db.query(`
    SELECT reviews.*, COUNT(reviews.review_id)::INT AS comment_count
    FROM reviews
    JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id`, [req.params.review_id]).then((review) =>{
        return Promise.all([exports.selectJustReview(req), review])
    }).then(([reviewForId, reviewWithComments]) =>{
        //There is a review for that id, but no comments
        if(reviewWithComments.rows.length === 0){
            return {comment_count : 0, ...reviewForId[0]}
        } else{
            return reviewWithComments.rows[0];
        }
    })
}

exports.updateReview = (req, inc_votes) =>{
    if(!inc_votes){
        return Promise.reject({status : 400, msg : "Bad request: missing update property"})
    }

    return db.query(
        `UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *`, [inc_votes, req.params.review_id]).then((review) =>{
            if(review.rows.length === 0){
                return Promise.reject({status : 404, msg : "Review id does not exist"})
            } else{
                return review.rows[0];
            }
        })
}

exports.selectJustReview = (req) =>{
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [req.params.review_id]).then((review) =>{
        if(review.rows.length === 0){
            return Promise.reject({status: 404, msg: "Review id does not exist"})
        } else {
            return review.rows;
        }
    })
}