const db = require("../db/connection");

exports.selectReview = (req) =>{
    return db.query(`SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at
    FROM reviews
    WHERE review_id = $1`, [req.params.review_id]).then((review) =>{
        if(review.rows.length === 0){
            return Promise.reject({status: 404, msg: "Review id does not exist"})
        }else {
            return review.rows[0];
        }
    });
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