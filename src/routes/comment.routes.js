import { getVideoComments, 
    addComment, 
    updateComment,
     deleteComment } from "../controllers/comment.controller.js";
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";

const commentRouter = Router()
commentRouter.use(authMiddleware)
commentRouter.route("/")
.post(addComment)
.patch(updateComment)
.delete(deleteComment)

export default commentRouter