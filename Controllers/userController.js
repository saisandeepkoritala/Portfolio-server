const User = require("../Models/userModel");
const Feedback = require("../Models/feedbackModel");
exports.saveInfo=async(req,res,next)=>{
    try{
        const user = await User.create({
            Address:req.body.Address,
            Time:req.body.Time
        })

        res.status(200).json({
            status:"success",
            userData:user
        })
    }
    catch(e){
        console.log(e)
        res.status(400).json({
            status:"fail",
            error:e
        })
    }
}

exports.feedbackUser =async(req,res,next)=>{
    try{

        const feedback = await Feedback.create({
            Name:req.body.name,
            Email:req.body.email,
            Subject:req.body.subject,
            Content:req.body.content,
            Time:Date.now()
        })

        res.status(200).json({
            status:"success",
            feedbackData:feedback
        })  

    }
    catch(e){
        
        res.status(400).json({
            status:"fail",
            error:e
        })
    }
}