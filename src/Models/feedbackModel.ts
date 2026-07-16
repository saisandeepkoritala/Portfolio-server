import mongoose from "mongoose";
import validator from "validator";

const feedbackSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:[true,"Name is Needed"]
    },
    Email:{
        type:String,
        required:[true,"Email is Needed"],
        validate:[validator.isEmail,"Please Provide a valid email"]
    },
    Subject:{
        type:String,
        required:[true,"Subject is Needed"]
    },
    Content:{
        type:String,
        required:[true,"Content is Needed"]
    },
    Time:{
        type:Date,
        required:[true,"Time is Needed"]
    },
}) 

export const Feedback = mongoose.model("feedback",feedbackSchema);
