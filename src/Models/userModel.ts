import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    Address:{
        type:String,
        required:[true,"Name is Needed"]
    },
    Time:{
        type:Date,
        required:[true,"Time is Needed"]
    }
}) 

export const User = mongoose.model("user",userSchema);
