import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.models.js"
import { ApiResponse } from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const getAllChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {
        page=1,
        query="",
        limit=1000,
        sortedBy="createdAt",
        sortType=1,
    } = req.query
    let skip=( page-1 )*limit
    // const videos= await Video.findOne({owner:user})
    const aggregationPipeline= Video.aggregate(
        [
            {$match:{
                $or:[
                    { title:{$regex:query , $options:'i'} },
                    {description:{$regex:query , $options:'i'} }
                ]   
            }},
            {
                $lookup: {
                    from: 'users', // 👈 collection name (usually lowercase plural of the model)
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            },
            {
                $unwind: '$ownerDetails' // so you can access fields directly
            },
            {
                $addFields: {
                    ownerAvatar: '$ownerDetails.avatar' // or whatever field holds the avatar URL
                }
            },
            {
                $sort:{ [sortedBy]:Number(sortType) }
            },
            {$skip:Number(skip)},
            {$limit:Number(limit)}
        ]
    )
    const totalPages=2

    // Use aggregatePaginate on the aggregation instance
    Video.aggregatePaginate(aggregationPipeline, {
        page: Number(page),
        limit: Number(limit),
        totalPages:Number(totalPages)
    })
    .then((result)=>{
        return res.status(200)
        .json(new ApiResponse(200,result,"Successfully data fetched"))    
    })
    .catch((error)=>{
        console.log(error,"error found in aggregatePaginate of getAllVideo")
        throw error
    }) 
})

export {getAllChannelVideos}