import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const authMiddleware=asyncHandler(async(req,_,next)=>{
    //cookie ya header me se accessToken launga
    //check data cookie se aaya ki nahi
    //decode the jwt token
    //decoded value me se id leke db me searh karke data nikalo usme se password aur refresh token remove kar do
    //check db me se data aaya ki nahi
    //req.user me user bhejdo 
    //call to the next

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","");
        // console.log(token)
        if(!token){
            throw new ApiError(401,"access Token not found")
        }
        const decode=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const val=decode._id
        // console.log(val)
        const user=await User.findOne({"_id":val})
        // console.log(user)
        if(!user){
            throw new ApiError(401," Something wrong in authMiddleware");
        }
        req.user=user
        // console.log(user)
        next() 

    } catch (error) {
        throw new ApiError(401,error?.message||"Invalid access token")
    }

})
export default authMiddleware