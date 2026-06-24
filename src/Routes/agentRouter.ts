import { runProductAgent } from "@/Rag/Agent/agent";
import { Router, Request, Response } from "express";

export const agentRouter = Router();

interface ChatRequestBody {
  message: string;
  threadId?: string;
}

agentRouter.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const result = await runProductAgent([
      {
        role: "user",
        content: message,
      },
    ]);

    return res.status(200).json(result);
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }

});