import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";
import { env } from "./Shared/env";

const DB_URI = env.DATABASE_URI;

mongoose.connect(DB_URI, {
  dbName: env.DATABASE_NAME
})
  .then(() => {
    console.log("Connection is Successful to DB via Mongoose...");
    app.listen(env.PORT, () => {
      console.log(`Server Running on port ${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error in connecting to DB...", err);
    process.exit(1);
  });