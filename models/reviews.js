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