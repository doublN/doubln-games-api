const db = require ("../db/connection")

exports.selectCategories = () =>{
    return db.query("SELECT * FROM categories").then((categories) =>{
        return categories.rows;
    })
}

exports.checkCategoryExsists = (slug) =>{
    return db.query("SELECT * FROM categories WHERE slug = $1", [slug]).then((category) =>{
        if(category.rows.length === 0){
            return Promise.reject({status : 404, msg : "Invalid request"})
        }else { 
            return category.rows;
        }
    })
}