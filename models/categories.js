const db = require ("../db/connection")

exports.selectCategories = () =>{
    return db.query("SELECT * FROM categories").then((categories) =>{
        console.log(categories)
        return categories.rows;
    })
}