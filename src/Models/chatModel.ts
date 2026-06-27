import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    question:{
        type:String,
        required : [true,"Need question"]
    },
    answer:{
        type:String,
        required : [true,"Need answer"]
    },
    threadId:{
        type:String,
        required:[true,"Threadid needed"]
    },
    Time:{
        type:Date,
        required:[true,"Time is Needed"]
    }
}) 

export const Chat = mongoose.model("chat",chatSchema);
