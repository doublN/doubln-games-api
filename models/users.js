const db = require("../db/connection");

exports.selectUsers = () =>{
    return db.query(`SELECT * FROM users`).then((users) =>{
        return users.rows;
    })
}

exports.selectUserByUsername = (req) =>{
    return db.query(`SELECT * FROM users WHERE username = $1`, [req.params.username]).then((user) =>{
        if(user.rows.length === 0){
            return Promise.reject({status:404, msg:"username does not exist"})
        } else{
            return user.rows[0];
        }
    })
}