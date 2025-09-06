import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.models.js" 
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name.trim() || !description.trim()) throw new ApiError(401,"name not exist in createPlaylist")
    
    const createOnePlaylist = await Playlist.create({
        name,
        description,
        owner:req.user?._id,
    })

    if(!createOnePlaylist) throw new ApiError(401,"createOnePlaylist not exist in createPlaylist")
    
    res
    .status(200)
    .json( new ApiResponse(200,createOnePlaylist,`successfully create playlist ${createOnePlaylist?.name}`))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.query
    if(!isValidObjectId(userId)) throw new ApiError(401,"userId not exist in getUserPlaylist")
    //TODO: get user playlists
    const user=await User.findById({_id:userId})
    if(!user) throw new ApiError(401,"user not found in getUserPlaylists")
        
    const findPlaylist=await Playlist.findOne({owner:userId})
    if(!findPlaylist) throw new ApiError(401,"playlist not found in getUserPlaylists")

    if(req.user?._id.toString() !== findPlaylist.owner.toString()) throw new ApiError(401,"Unauthorized validation in getUserPlaylist")
    
    const allAutherizedUserPlaylist= await Playlist.aggregate([
        {
          $match: {
            owner: userId,
          },
        },
        {
          $project: {
              name:1
          }
        }
      ] )


      return res.status(200)
      .json( new ApiResponse(200,allAutherizedUserPlaylist,"successfully found all playlist"))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.query
    if(!isValidObjectId(playlistId)) throw new ApiError(401,"not valid playlistId in getPlaylistById")
    //TODO: get playlist by id

    const playlist=await Playlist.findById({
        _id:playlistId
    })
    if(!playlist) throw new ApiError(401,"playlist not found in getPlaylistById")
    if(req.user?._id.toString() !== playlist.owner.toString()) throw new ApiError(401,"Unauthorized validation in addVideoToPlaylist")

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"succesfully find playlist"))


})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.query
    if(!isValidObjectId(playlistId)) throw new ApiError(401,"PlaylistId not found in addVideoToPlaylist")
    if(!isValidObjectId(videoId)) throw new ApiError(401,"videoId not found in addVideoToPlaylist")
    
    const findPlaylist= await Playlist.findById({_id:playlistId})
    if(!findPlaylist) throw new ApiError(401,"Playlist not found in addVideoToPlaylist")

    const findVideo= await Video.findById({_id:videoId})
    if(!findVideo) throw new ApiError(401,"video not found")
    
    
    if(req.user?._id.toString() !== findPlaylist.owner.toString()) throw new ApiError(401,"Unauthorized validation in addVideoToPlaylist")
    console.log(findPlaylist.videos)
    if(findPlaylist.videos){
        if(findPlaylist.videos.forEach(element => {     
            element.equal(videoId.toString())
        })) throw new ApiError(401,"video already exist")
    }
    
    const updatePlaylist= await Playlist.findByIdAndUpdate({
        _id:playlistId
    },
    {
        $push:{
            videos:videoId
        }
    },{
        new:true
    }
)
    if(!updatePlaylist) throw new ApiError(401,"Playlist not updated in addVideoToPlaylist")
    res
    .status(200)
    .json(new ApiResponse(201,updatePlaylist,"successfully playlist updated"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.query
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId)) throw new ApiError(401,"PlaylistId not found in removeVideoFromPlaylist")
    if(!isValidObjectId(videoId)) throw new ApiError(401,"videoId not found in removeVideoFromPlaylist")
        
    const findPlaylist= await Playlist.findById({_id:playlistId})
    if(!findPlaylist) throw new ApiError(401,"Playlist not found in removeVideoFromPlaylist")
    
    const findVideo= await Video.findById({_id:videoId})
    if(!findVideo) throw new ApiError(401,"video not found")
        
        
    if(req.user?._id.toString() !== findPlaylist.owner.toString()) throw new ApiError(401,"Unauthorized validation in removeVideoFromPlaylist")
    
    if(findPlaylist.videos){
        if(!findPlaylist.videos.some((video)=>{
            video.equal(videoId)
        })) throw new ApiError(401,"video not exist in playlist")
    }
        
    const updatePlaylist= await Playlist.findByIdAndUpdate({
        _id:playlistId
    },
    {
        $pull:{
            videos:videoId
        }
    },{
        new:true
    }
    )
    if(!updatePlaylist) throw new ApiError(401,"Playlist not updated in removeVideoFromPlaylist")
    res
    .status(200)
    .json(new ApiResponse(201,updatePlaylist,"successfully delete video from playlist"))

})

const deletePlaylist = asyncHandler(async (req, res) => { 
    const {playlistId} = req.query
    // TODO: delete playlist
    
    if(!isValidObjectId(playlistId)) throw new ApiError(401,"playlistid not exist in deletePlaylist")

    const findPlaylist=await Playlist.findById({_id:playlistId})
    if(!findPlaylist) throw new ApiError(401,"Playlist not found in deletePlaylist")
    
    if(req.user?._id.toString() !== findPlaylist.owner.toString()) throw new ApiError(401,"Unauthorized validation in removeVideoFromPlaylist")

    
    const findAndDeletePlaylist = await Playlist.findByIdAndDelete({ _id : playlistId})
    if(!findAndDeletePlaylist) throw new ApiError(401,"playlist not exist in deletePlaylist")
    
    res
    .status(200)
    .json( new ApiResponse(201,findAndDeletePlaylist,"Successfully Delete Playlist"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.query
    const {name, description} = req.body
    if(!playlistId) throw new ApiError(401,"playlistId not exist in updatePlaylist")
    const queryAll={}
    if(name) queryAll["name"]=name
    if(description) queryAll["description"]=description

    //TODO: update playlist
    const ownerOfPlaylist=await Playlist.findById({_id:playlistId})
    if(req.user?._id.toString()!== ownerOfPlaylist?.owner.toString()) throw new ApiError(401,"Unauthorised credidential in updatePlaylist")
    
    console.log(queryAll)
    const updatePlaylistInDb= await Playlist.findByIdAndUpdate({_id : playlistId},queryAll)
    if(!updatePlaylist) throw new ApiError(401,"not update in updatePlaylist")

    res
    .status(200)
    .json(new ApiResponse(201,updatePlaylistInDb,`Successfully Update in updatePlatlist`))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}