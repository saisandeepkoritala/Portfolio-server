const mongoose = require("mongoose");

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

const User = mongoose.model("user",userSchema);

module.exports = User;