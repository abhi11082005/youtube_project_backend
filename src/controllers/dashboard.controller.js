import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.model.js"
import { User } from "../models/user.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const { videoId } = req.query;
    if(!videoId) throw new ApiError(401, "videoId not exist")
  
    // Step 1: Get the video and extract owner ID
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");
  
    const ownerId = video.owner;
  
    // Step 2: Aggregate stats based on owner
    const stats = await Video.aggregate([
      { $match: { owner: ownerId } },
  
      
    ]);
  
    // Step 3: Get subscriber count from User
    const user = await User.findById(ownerId, "subscribers");
    const totalSubscribers = user?.subscribers?.length || 0;
  
    const {
      totalVideos,
      totalViews,
      totalLikes,
      totalComments,
      comments,
      playlists
    } = stats[0];
  
    res.status(200).json(
      new ApiResponse(200, {
        ownerId,
        totalVideos: totalVideos[0]?.count || 0,
        totalViews: totalViews[0]?.views || 0,
        totalLikes: totalLikes[0]?.likes || 0,
        totalComments: totalComments[0]?.commentsCount || 0,
        totalSubscribers,
        comments,
        playlists
      }, "Channel stats fetched successfully")
    );
  });
  
const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
    }