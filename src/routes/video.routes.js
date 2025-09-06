import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middlewares.js"
import { Router } from "express";
import { publishAVideo , getVideoById, updateVideo, deleteVideo, getAllVideo,getUserVideos} from "../controllers/video.controller.js";

const videoRouter=Router()
videoRouter.use(authMiddleware)

videoRouter.route("/").post(
    upload.fields([
        {
            name: "videofile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ])
    ,publishAVideo)
    .get(getAllVideo)

videoRouter.route("/videoid").get(getVideoById)
    .post(upload.single("thumbnail"),updateVideo)
    .delete(deleteVideo)
videoRouter.route("/uservideo").get(getUserVideos)



export default videoRouter