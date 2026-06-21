import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import userRouter from "./Routes/userRoutes";


const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:5173", 
        "https://saisandeepkoritala-portfolio.netlify.app"]
}));


app.use("/api/v1/user",userRouter);

export default app;