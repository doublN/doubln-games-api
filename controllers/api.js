fs = require("fs/promises")

exports.getEndpoints = ((req, res) =>{
    fs.readFile("./endpoints.json", "utf-8").then((endpoints) =>{
        res.status(200).send({endpoints})
    })
})