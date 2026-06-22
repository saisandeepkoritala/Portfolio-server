import { Request, Response } from 'express';
import {User} from '@/Models/userModel';
import { Feedback } from '@/Models/feedbackModel';

export const saveInfo = async(req : Request,res : Response)=>{
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
};

export const feedbackUser = async(req : Request,res : Response)=>{
    try{
        const feedback = await Feedback.create({
            Name:req.body.name,
            Email:req.body.email,
            Subject:req.body.subject,
            Content:req.body.content,
            Time:Date.now()
        })

        res.status(200).json({
            status:"Success....",
            feedbackData : feedback
        })  

    }
    catch(e : any){
        res.status(500).json({
            status : "Something went wrong...",
            error:e
        })
    }
};