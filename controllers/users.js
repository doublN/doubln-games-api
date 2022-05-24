const {
    selectUsers,
    selectUserByUsername,
} = require("../models/users")

exports.getUsers = (req, res) =>{
    selectUsers().then((users) =>{
        res.status(200).send({users})
    })
}

exports.getUserByUsername = (req, res, next) =>{
    selectUserByUsername(req).then((user) =>{
        res.status(200).send({user})
    }).catch((err) =>{
        next(err);
    })
}