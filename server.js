import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const DB = process.env.DATABASE.replace("<PASSWORD>",process.env.PASSWORD);

mongoose.connect(DB)
.then((res)=>console.log("Connection is Successful to DB"))
.catch((err)=>console.log("Error in connecting to DB",err))

app.listen(process.env.PORT,()=>{
    console.log(`Server Running on port `,process.env.PORT)
})