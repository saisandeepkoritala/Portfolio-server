const User = require("../Models/userModel");
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