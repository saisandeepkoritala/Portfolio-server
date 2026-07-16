import { Request, Response } from 'express';
import { Feedback } from '@/Models/feedbackModel';


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

export const isAlive = async(req : Request,res : Response)=>{
    try{
        res.status(200).json({
            status:"Success",
            message:"Server is Alive..."
        })
    }
    catch(err : any){
        res.status(500).json({
            status : "Something went wrong...",
            error:err
        })
    }
}
