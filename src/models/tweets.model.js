import mongoose,{Schema} from mongoose

const tweetSchema=new Schema({
    owner:{
        type:Schema.Type.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    }
},{timestamps:true})

export const Tweet=mongoose.model("Tweet",tweetSchema)