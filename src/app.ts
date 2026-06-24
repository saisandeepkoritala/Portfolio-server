import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import {router} from "./Routes/userRoutes";
import { kbRouter } from './Routes/kbRouter';
import { agentRouter } from './Routes/agentRouter';


const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:5173", 
        "https://saisandeepkoritala-portfolio.netlify.app"]
}));


app.use("/api/v1/user",router);
app.use("/api/v1/agent",kbRouter);
app.use("/api/v1/askBot",agentRouter)

export default app;