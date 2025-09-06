import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"

import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    //Also use upset in mongodb to create subscribers try it
    const {channelId} = req.query
    if(!isValidObjectId(channelId)) throw new ApiError(401,"channel Id not present in toggleSubscrioption")
    // TODO: toggle subscription
    const channel= await Subscription.findOne({channel:channelId})
    if(channel){
        const deleteChannelSubscriber=await Subscription.findOneAndDelete({subscriber:req.user?._id})
        if(!deleteChannelSubscriber) throw new ApiError(401,"channel doesn't unsubscribe by user")
        
        return res
        .status(200)
        .json(new ApiResponse(201,deleteChannelSubscriber,"Here channel got unsubscribe by user"))
    }
    else{
        const createSubscriber= await Subscription.create({
            channel:channelId,
            subscriber:req.user?._id
        })
        if(!createSubscriber) throw new ApiError(401,"channel doesn't subscribe by user")
        return res
        .status(200)
        .json(new ApiResponse(200,createSubscriber,"Here channel got subscribe by user"))
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.query
    if(!isValidObjectId(channelId)) throw new ApiError(401,"channelId not exist in getUserChannelSubscribers")
    
    const subscribers= await Subscription.aggregate(
        [
            {
                $match:{ channel:req.user?._id }
            },
            {
                subscriberCount:{$sum:1}
            }
        ]
    )
    
    if(!subscribers) throw new ApiError(401,"channel doesn't exist")
    return res
    .status(200)
    .json(new ApiResponse(200,subscribers?.subscriberCount,"subscriber of my channel"))
    
    
    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.query
    if(!isValidObjectId(subscriberId)) throw new ApiError(401,"subscriberId not exist in getSubscribedChannels")
    
    const subscribedChannels= await Subscription.aggregate(
        [
            {
                $match:{subscriber : subscriberId}
            },
            {
                subscribedChannelsCount:{$sum:1}
            }
        ]
    )
    if(!subscribedChannels) throw new ApiError(401,"you haven't any subscriber")
    
    return res
    .status(200)
    .json(new ApiResponse(200,subscribedChannels?.subscribedChannelsCount,"my subscribed channels"))
    
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}