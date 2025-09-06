import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import {getAllChannelVideos} from "../controllers/maindashboard.controller.js"



const mainDashboardRouter=Router()
mainDashboardRouter.route('/notlog')
.get(getAllChannelVideos)
mainDashboardRouter.use(authMiddleware)

mainDashboardRouter.route('/')
.get(getAllChannelVideos)

export default mainDashboardRouter