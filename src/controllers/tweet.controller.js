import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweets.model.js"
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body
    if(!content) throw new ApiError(401,"content not exist in createTweet")
    
    const tweet = await Tweet.create({
        owner:req.user?._id,
        content:content
    })
    if(!tweet) throw new ApiError(401,"tweet not found in createTweet")
    req
    .status(200)
    .json(new ApiResponse(200,tweet,"tweet successfully added in createTweet"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    
    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {newContent}=req.body
    const {tweetId} = req.query
    if(!newContent) throw new ApiError(401,"newContent not found in updateTweet")
    if(!isValidObjectId(tweetId)) throw new ApiError(401,"tweetId is not valid in update")
    
    const tweet=await Tweet.findByIdAndUpdate({_id:tweetId},{content:newContent})
    if(!tweet) throw new ApiError(401,"tweet not exist in db in updateTweet")

    // if(tweet.owner.toString() !== req.user?._id.toString()) throw new ApiError(401,"unauthorise user")

    res
    .status(200)
    .json(new ApiResponse(200,tweet,"Update Tweet Successfully"))
    
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.query
    if(!isValidObjectId(tweetId)) throw new ApiError(401,"tweet Id not found in deleteTweet")

    const tweet=await Tweet.findByIdAndDelete({_id:tweetId})
    if(!tweet) throw new ApiError(401,"Tweet not deleted in deleteTweet")
    
    req
    .status(201)
    .json(new ApiResponse(200,tweet,"Tweet successfully Deleted"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}