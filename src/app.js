import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))                                                               // jo bhi frontend(cors_origin pe jo jo link present hoga) se aayega usse 
//                                                               //  server pe serve kar dega  example ghar pe kewal apne pahechan walo ko hi entry dete hai
app.use(express.json({limit:"16kb"}))                           //   jo bhi url me data hoga use json form me req karke le sakte hai 
app.use(express.urlencoded({extended: true, limit:"16kb"}))    //    encode the  url such that no any information show on url but data extract from that url

app.use(express.static("public"))                            //      public me jo bhi  rakhunga vo server pe serve hoga
app.use(cookieParser())                                     //       to automatically parse and extract cookie data from an HTTP request

import userRouter from "./routes/user.routes.js"
app.use("/users",userRouter)
import videoRouter from "./routes/video.routes.js"
app.use("/video",videoRouter)
import subscriptionRouter from "./routes/subscription.routes.js"
app.use("/subscription",subscriptionRouter)
import playlistRouter from "./routes/playlist.routes.js"
app.use("/playlist",playlistRouter)
import commentRouter from "./routes/comment.routes.js"
app.use("/comment",commentRouter)
import likeRouter from "./routes/like.routes.js"
app.use("/like",likeRouter)
import mainDashboardRouter from "./routes/maindashboard.routes.js"
app.use("/maindashboard",mainDashboardRouter)
import dashboardRouter from "./routes/dashboard.routes.js"
app.use("/dashboard",dashboardRouter)
// //routes import
// import userRouter from "./routes/user.routes.js"

// //routes declaration
// app.use("/users",userRouter)

//http://localhost:8000/api/abhi/users  =>userrouter ko paas kar dega  =>/register path added
export default app;