import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { toggleSubscription,getSubscribedChannels,getUserChannelSubscribers } from "../controllers/subscription.controller.js";

const subscriptionRouter=Router()
subscriptionRouter.use(authMiddleware)

subscriptionRouter
.route("/:channeliId")
.get(getUserChannelSubscribers)
.post(toggleSubscription)

subscriptionRouter
.route("/:subscriberId")
.get(getSubscribedChannels)

export default subscriptionRouter