const commentsRouter = require("express").Router();
const { 
    deleteCommentByCommentId,
    patchCommentByCommentId,
} = require("../controllers/comments");
const comments = require("../db/data/test-data/comments");


commentsRouter.route("/:comment_id")
.delete(deleteCommentByCommentId)
.patch(patchCommentByCommentId);

module.exports = commentsRouter;