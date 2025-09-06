import mongoose from "mongoose"
import bcrypt from "bcryptjs"   //used for password hashing
import jwt from "jsonwebtoken" //use to make tokens



const userSchema= new mongoose.Schema({
  username:{
    type:String,
    unique:true,
    lowercase:true,
    trim:true,
    required:true,
  },
  email:{
    type:String,
    unique:true,
    lowercase:true,
    trim:true,
    required:true,
  },
  fullname:{
    type:String,
    required:true,
    trim:true,
    index: true,                          
  },
  avatar:{
    type:String,  //cloudinary data
    required:true,
  },
  coverImage:{
    type:String,
  },
  password:{
    type:String,
    required:[true,"Password is required"],
  },
  watchHistory:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Video"
    }
  ],
  refreshToken:{
    type:String,
  }

},{timestamps:true})

userSchema.pre("save",async function(next){     //don't use callback function because "this" is not used in callback
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
        next()
    }
})

userSchema.methods.isPasswordCorrect= async function (password) {
    return await bcrypt.compare(password,this.password)   ///return true or false
}
userSchema.methods.generateAcessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema)
