const express = require("express");
const userRouter = require("./Routes/userRoutes");
const cors=require("cors");
const morgan = require("morgan");


const app = express();
app.use(express.json());
app.use(morgan("dev"));


app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:5173", "https://saisandeepkoritala-portfolio.netlify.app"]
}));


app.use("/api/v1/user",userRouter);


module.exports = app;