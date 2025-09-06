import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import express from "express"
import {app as ap} from "./app.js"
import { ApiError } from "./utils/apiError.js";
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config({
    path:'./.env'
})

const app=express()
connectDB()
.then(()=>{
    // app.listen(process.env.PORT|| 8001 , ()=>{
    //     console.log(`Server is running on Port: ${process.env.PORT}`)
    // })
    
    app.on("error",(error)=>{
        console.log("ERROR: ",error)
        throw error
    })
})
.catch((err)=>{
    console.log(`MongoDB error in index.js of src ${err}`)
})

app.use(ap)

export default app;















/*
import express from "express"
const app=express()
//this code is first approach
( async()=>{
    try{
        // for connection of database 
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Err: ",error);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`abhitube run on Port: ${process.env.PORT}`)
        })
    } catch(error){
        console.log("ERROR: ",error)
        throw error
    }
    
})()
    */