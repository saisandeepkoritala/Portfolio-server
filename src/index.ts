import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";
import { env } from "./Shared/env";

const DB_URI = env.DATABASE_URI;

// 1. Fallback to 10000 if env.PORT is undefined (Render's default web service port)
const PORT = env.PORT || 10000;

mongoose.connect(DB_URI, {
  dbName: env.DATABASE_NAME
})
  .then(() => {
    console.log("Connection is Successful to DB via Mongoose...");
    
    // 2. Bind explicitly to '0.0.0.0' so the Docker container can accept outside traffic
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error in connecting to DB...", err);
    process.exit(1);
  });