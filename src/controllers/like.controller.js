import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.query
    if(!videoId) throw new ApiError(401,"videoId not exist in toggleVideoLike")
    //TODO: toggle like on video 
    const checkVideoLikeExistOrNot = await Like.findOne({
        video:videoId,
        likedBy:req.user?._id,
    })
    if(checkVideoLikeExistOrNot){
        const deleteVideoLike = await Like.deleteMany({
            video:videoId,
            likedBy:req.user?._id,
        })
        if(!deleteVideoLike) throw new ApiError(400,"video is not deleted in toggleVideoLike")
        return res
        .status(200)
        .json(new ApiResponse(200,{like:false}, "successfully dislike video"))
    }
    else{
        const createVideoLike= await Like.create({
            video:videoId,
            likedBy:req.user?._id
        })
        if(!createVideoLike) throw new ApiError(400,"video not liked in toggleVideoLike")
        return res
        .status(200)
        .json(new ApiResponse(200,{like:true}, "successfully like video"))
    }

    
    
    
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.query
    if(!commentId) throw new ApiError(400,"commentid not exist in togglecommentLike")
    //TODO: toggle like on comment
    const checkVideoLikeExistOrNot = await Like.find({
        comment:commentId,
        likedBy:req.user?._id,
    })
    if(checkVideoLikeExistOrNot){
        const deleteVideoLike = await Like.deleteMany({
            comment:commentId,
            likedBy:req.user?._id,
        })
        if(!deleteVideoLike) throw new ApiError(400,"video is not deleted in toggleVideoLike")
        return res
        .status(200)
        .json(new ApiResponse(200,{like:false}, "successfully dislike video"))
    }
    else{
        const createVideoLike= await Like.create({
            comment:commentId,
            likedBy:req.user?._id
        })
        if(!createVideoLike) throw new ApiError(400,"video not liked in toggleVideoLike")
        return res
        .status(200)
        .json(new ApiResponse(200,{like:true}, "successfully like video"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId) throw new ApiError(400,"tweetId not exist in toggleTweetId")

    //TODO: toggle like on tweet
    const checkVideoLikeExistOrNot = await Like.find({
        tweet:tweetId,
        likedBy:req.user?._id,
    })
    if(checkVideoLikeExistOrNot){
        const deleteVideoLike = await Like.deleteMany({
            tweet:tweetId,
            likedBy:req.user?._id,
        })
        if(!deleteVideoLike) throw new ApiError(400,"video is not deleted in toggleVideoLike")
        return res
        .status(200)
        .json(new ApiResponse(200,{like:false}, "successfully dislike video"))
    }
    else{
        const createVideoLike= await Like.create({
            tweet:tweetId,
            likedBy:req.user?._id
        })
        if(!createVideoLike) throw new ApiError(400,"video not liked in toggleVideoLike")
        return res
        .status(200)
        .json(new ApiResponse(200,{like:true}, "successfully like video"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {videoId} = req.query
    if(!videoId) throw new ApiError(401,"videoId not exist in getLikedVideos")
        console.log(videoId)
        const likesCount = await Like.aggregate([
            {
              $match: {
                video: new mongoose.Types.ObjectId(videoId)
              }
            },
            {
              $group: {
                _id: "null",              // group by video ID (can also be null if not needed)
                likedCount: { $sum: 1 }     // count how many likes
              }
            }
          ]);
          console.log(likesCount[0])
    if(!likesCount){
        return res.
        status(200)
        .json(new ApiResponse(200,{likeCount:0},"no likes exist on this video in getLikedVideos"))
    }
    else{
        return res
        .status(200)
        .json(new ApiResponse(200,{likedCount:likesCount[0]?.likedCount},` total like recieved is ${likesCount[0]?.likedCount} in getLikedVideos`))
    }
    
})

const getLikedComment = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {commentId} = req.params
    if(!commentId) throw new ApiError(401,"videoId not exist in toggleVideoLike")
    
        const likesCommentCount = await Like.aggregate([
            {
              $match: {
                video: new mongoose.Types.ObjectId(commentId)
              }
            },
            {
              $group: {
                _id: "null",              // group by video ID (can also be null if not needed)
                likedCount: { $sum: 1 }     // count how many likes
              }
            }
          ]);
    if(!likesCount){
        return res.
        status(200)
        .json(new ApiResponse(200,{likeCount:0},"no likes exist on this video in getLikedVideos"))
    }
    else{
        return res
        .status(200)
        .json(new ApiResponse(200,{likedCount:likesCommentCount[0]?.likedcount},` total like recieved is ${likesCommentCount[0]?.likedCount} in getLikedVideos`))
    }
    
})

const getLikedTweet = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const {tweetId} = req.params
    if(!tweetId) throw new ApiError(401,"videoId not exist in toggleVideoLike")
    
        const likesCount = await Like.aggregate([
            {
              $match: {
                video: new mongoose.Types.ObjectId(tweetId)
              }
            },
            {
              $group: {
                _id: "null",              // group by video ID (can also be null if not needed)
                likedCount: { $sum: 1 }     // count how many likes
              }
            }
          ]);
    if(!likesCount){
        return res.
        status(200)
        .json(new ApiResponse(200,{likeCount:0},"no likes exist on this video in getLikedVideos"))
    }
    else{
        return res
        .status(200)
        .json(new ApiResponse(200,{likedCount:likesCount[0]?.likedcount},` total like recieved is ${likesCount[0]?.likedCount} in getLikedVideos`))
    }
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedComment,
    getLikedTweet
}