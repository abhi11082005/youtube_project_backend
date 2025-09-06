import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { getChannelStats } from "../controllers/dashboard.controller.js";

const dashboardRouter=Router()
dashboardRouter.use(authMiddleware)

dashboardRouter.route('/')
.get(getChannelStats)

export default dashboardRouter