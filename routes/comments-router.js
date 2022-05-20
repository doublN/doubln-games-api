const commentsRouter = require("express").Router();
const { 
    deleteCommentByCommentId
} = require("../controllers/comments");


commentsRouter.delete("/:comment_id", deleteCommentByCommentId)

module.exports = commentsRouter;