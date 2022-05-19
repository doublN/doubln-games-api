const db = require("../db/connection");
const {checkCategoryExsists} = require("./categories")

exports.selectReviews = (sort_by='created_at', order='desc', category) =>{
    const queryVals = [];

    const validSortBy = ["title", "category", "designer", "owner", "votes", "comment_count", "created_at"];
    const validOrder = ["asc", "desc"];

    let queryText = `SELECT reviews.*, COUNT(reviews.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id `

    if(category){
        queryText += 'WHERE category = $1 '
        queryVals.push(category)
    }
    
    queryText += `GROUP BY reviews.review_id `
    
    if(validSortBy.includes(sort_by)){
        queryText += `ORDER BY ${sort_by} `
    } else {
        return Promise.reject({status : 400, msg : "Invalid sort query"})
    }
    
    if(validOrder.includes(order)){
        queryText += `${order} `
    } else {
        return Promise.reject({status : 400, msg : "Invalid order query"})
    }
    
    return db.query(queryText, queryVals).then((reviews) =>{
        const promiseArr = [reviews];

        if(category){
            promiseArr.push(checkCategoryExsists(category))
        }

       return Promise.all(promiseArr);
    }).then(([reviews, category]) =>{
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