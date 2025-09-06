import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
const generateAcessTokenandRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAcessToken()
        if(!accessToken){ 
            throw new ApiError(401,"accessToken not find")
        }
        const refreshToken=user.generateRefreshToken()
        console.log(refreshToken)
        if(!refreshToken){
            throw new ApiError(401,"refreshToken not find")
        }
        user.refreshToken=refreshToken
        //want to know 
        user.save({validateBeforeSave:false})
        return {refreshToken,accessToken}
    } catch (error) {
        throw new ApiError(401,"Token not generated")
    }
}
const registerUser = asyncHandler( async(req,res) => {
    //get user detail from frontend
    //validation - required filled not empty  backend check
    //check if user already exists: using username and email                 khud se check username agar enter ho to db me existance hai ki nahi
    //check for images ,check for avatar
    //uploadd them to  cloudinary avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response

//form ya json se data aata hai to req.body me mil jata hai
    
    const {username,email,fullname,password} = req.body
    console.log(`username:${username}/n email:${email} /n fullname:${fullname}/n password:${password}/n`)
    if([username,email,fullname,password].some((field)=>{
        //? use because if value of field is null then it will not give an error
        field?.trim()===""
    })){
        throw new ApiError(200,"Required all fields")
    }
    const data=await User.findOne({
        $or: [{ username }, { email }]
    })
    if(data) throw new ApiError(200,"User Exist")
    
    //local path of images
    // const avatarLocalPath=req.files?.avatar?.[0]?.path;
    let avatarLocalPath;
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path
    }
    console.log(avatarLocalPath)
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    // console.log("coverImage" ,coverImageLocalPath)
    if(!avatarLocalPath) throw new ApiError(200,"Avatar not found")

    //upload on cloudinary
    const uploadAvatar=await uploadOnCloudinary(avatarLocalPath)
    const uploadCoverImage=await uploadOnCloudinary(coverImageLocalPath)
    console.log(uploadAvatar)
    

    const user=await User.create({username,email,fullname,password,avatar:uploadAvatar?.url,coverImage:uploadCoverImage?.url||""})
    
    //reduce the password and refresh token from user and store into createUser 
    const createUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createUser,"User registered successfully")
    )

} )

const loginUser=asyncHandler(async(req,res)=>{
    //data comes from frontend
    //check username and password is non empty
    // check username and password in db
    //generate accessToken and refreshToken
    //send cookie
    
    const {username,email,password} = req.body
    let query={};
    if (username) query.username = username;
    if (email) query.email = email;
    
    if(!username && !email){
        throw new ApiError(400,"username or email not found");
    }
    if(!password) {throw new ApiError(400,"password not found");
    }
    
    const user=await User.findOne({
        $or: [query]
    })
    if(!user) {
        throw new ApiError(400,"user not found")
    }
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid) {throw new ApiError(400,"Wrong Password")
}
    const {refreshToken,accessToken} = await generateAcessTokenandRefreshToken(user._id)
    if(!refreshToken){ throw new ApiError(400,"refreshToken not found")}
    if(!accessToken){ throw new ApiError(400,"accessToken not found")}
    const id=user._id
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    console.log(id)
    const options={
        // httpOnly:true,
        secure:true,
        sameSite: 'None' 
    }
    
    return res
    .status(200)
    .cookie('refreshToken',refreshToken,options)
    .cookie('accessToken',accessToken,options)
    .json(

        new ApiResponse(200,
            {
                user:loggedInUser,refreshToken,accessToken
            },
            "User succesfully logged in"
        )
    )
    
})

const logoutUser=asyncHandler(async(req,res)=>{
    //use req.user._id and updateandfind this id and clear the value of refreshtoken
    //clear the cookie 
    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    // console.log(user)

    const options={
        httpOnly:true,
        secure:true
    }
    // console.log(accessToken,"     ",refreshToken)
    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(new ApiResponse(200,{},"User logged out successfully"))

})

const refreshTokenHandler=asyncHandler(async(req,res)=>{
    //req.cookies.accesstoken  usko jwt se verify karke user id le lunga
    //db se call karke refresh token nikal lunga
    //req.cookie me se refresh token nikal lunga
    //dono match kara lo agar nahi hai to api error
    //naya refreshtoken generate karke uko db aur cookie dono me save kara lo
    //response me accessToken aur refreshToken bhej do

    const prevRefreshToken=req.cookies?.refreshToken
    const accessToken=req.cookies?.accessToken
    const user=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    const anotherPrevRefreshToken=await User.findById(user._id).refreshToken
    if(!anotherPrevRefreshToken) throw new ApiError(401,"here in refreshtokenHandler error occur in fetching anotherPrevRefreshToken")
    if(prevRefreshToken!==anotherPrevRefreshToken){
        throw new ApiError(401,"Invalid Credidential")
    }

    const newRefreshToken=await user.generateRefreshToken()
    user.refreshToken=newRefreshToken

    options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("refreshToken",newRefreshToken,options)
    .json(new ApiResponse(200,newRefreshToken,"new Refresh Token generated"))

    


})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body
    if(!oldPassword && !newPassword && !confirmPassword){
        throw new ApiError(401,"Old Password and New Password not comes")
    }
    if(newPassword!== confirmPassword){
        throw new ApiError(401,"Password mismatched")
    }
    //If user is loggedIn then there has access of changing the password 
    const user=await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(401,"Any thing wrong in Middleware")
    }
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401,"Invalid Credential")
    }
    user.password = newPassword
    user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed succesfully"))
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    console.log(req.user)
    return res
    .status(200)
    .json(200,req.user,"current user fetched Successfully")
})

const getUser=asyncHandler(async(req,res)=>{
    console.log(req.user)
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"current user fetched Successfully"))
})

const updateAccountDetail=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body
    console.log(fullname,email)
    if(!fullname || !email){
        throw new ApiError(401,"Fullname and Email not found")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        {new:true}
    ).select("-password,-refreshToken")
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account Details updated successfully"))

})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(401,"user not found in updateUserAvatar")
    }
    const newAvatar=req.file?.path
    console.log(newAvatar)
    if(!newAvatar){
        throw new ApiError(401,"Avatar not found in updateUserAvatar")
    }
    const upload=await uploadOnCloudinary(newAvatar)
    user.avatar=upload.url
    await user.save()
    return res
    .status(200)
    .json( new ApiResponse(200,newAvatar,"updated Successfully"))
})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user?._id)
    // console.log(user)
    if(!user){
        throw new ApiError(401,"user not found in updateUserCoverImage")
    }
    const coverImage=req.file?.path
    if(!coverImage){
        throw new ApiError(401,"coverImage not found")
    }
    const upload=await uploadOnCloudinary(coverImage)
    user.coverImage=upload
    await user.save()
    return res
    .status(200)
    .json(new ApiResponse(200,coverImage,"coverImage updated successfully"))
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.query

    if(!username){
        throw new ApiError(401,"username not found in gerUserChannelProfile")
    }

    const channel=await User.aggregate[
    {
        $match:{
            username:username?.toLowerCase()
        }
    },
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }
    },{
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
        }
    },
    {
        $addFields:{
            subscribersCount:{
                $size:"$subscribers"
            },
            channelSubscribedToCount:{
                $size:"$subscribedTo"
            },
            isSubscribed:{
                $cond:{ $in:[req.user?._id,"$subscribers.subscriber"]},
                then:true,
                else:false 
            }
        }
    },
    {
        $project:{
            fullName: 1,
            username: 1,
            subscribersCount: 1,
            channelsSubscribedToCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1
        }
    }
]
    if (!channel?.length) {
       throw new ApiError(404, "channel does not exists")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully")
        )
})

const getWatchHistory = asyncHandler( async(req,res) => {
    const watchHistory = await User.aggregate[
        {
            $match:req.user?._id
        },
        {
            $lookup : {
                from: "videos",
                localField:"watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline : [
                    {
                        $lookup : {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as:"owner",
                            pipeline : [
                                {
                                    $project: {
                                        fullName:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
    if(!watchHistory) throw new ApiError(401,"watch history not created in getWatchHistory")
    res
    .status(200)
    .json(new ApiResponse(201,watchHistory,"successfully watch History created"))
})

export {registerUser,
        loginUser,
        logoutUser,
        refreshTokenHandler,
        changeCurrentPassword,
        getCurrentUser,
        updateAccountDetail,
        updateUserAvatar,
        updateUserCoverImage,
        getUserChannelProfile,
        getWatchHistory,
        getUser
        
}