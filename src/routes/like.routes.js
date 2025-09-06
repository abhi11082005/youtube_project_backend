import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { 
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedComment,
    getLikedTweet
 } from "../controllers/like.controller.js";

 const likeRouter=Router()
likeRouter.use(authMiddleware)

likeRouter.route('/videolike').get(getLikedVideos)
.post(toggleVideoLike)
likeRouter.route('/commentlike').get(getLikedComment)
.post(toggleCommentLike)
likeRouter.route('/tweetlike').get(getLikedTweet)
.post(toggleTweetLike)



export default likeRouter