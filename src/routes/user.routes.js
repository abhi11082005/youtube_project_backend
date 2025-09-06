import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshTokenHandler,changeCurrentPassword,getCurrentUser,updateAccountDetail,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getUser} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middlewares.js"
const userRouter=Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
userRouter.route("/").get((req,res)=>{
    return res.send("Heloo")
})

userRouter.route("/login").post(
    loginUser
)
userRouter.route("/logout").post(authMiddleware,logoutUser)
userRouter.route("/refresh-token").post(authMiddleware,refreshTokenHandler)
userRouter.route("/changecurrentpassword").post(authMiddleware,changeCurrentPassword)
userRouter.route("/getCurrentUser").get(authMiddleware,getCurrentUser)
userRouter.route("/updateAccountDetail").post(authMiddleware,updateAccountDetail)
userRouter.route("/updateUserAvatar").post(authMiddleware,upload.single("avatar"),updateUserAvatar)
userRouter.route("/updateusercoverimage").post(authMiddleware,upload.single("coverImage"),updateUserCoverImage)
userRouter.route("/userprofile").get(authMiddleware,getUserChannelProfile)
userRouter.route("/getUser").get(authMiddleware,getUser)



export default userRouter