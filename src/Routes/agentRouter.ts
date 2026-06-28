import { runProductAgent } from "@/Rag/Agent/agent";
import { Router, Request, Response } from "express";
import { Chat } from "@/Models/chatModel";
import { ensureThreadId } from "@/Rag/Agent/memory";

export const agentRouter = Router();

interface ChatRequestBody {
  question: string;
  threadId?: string;
}

agentRouter.post("/chat", async (req : Request, res : Response) => {
  try {
    const { question,threadId } = req.body as ChatRequestBody;

    const extractedThreadId = await ensureThreadId(threadId);

    const result = await runProductAgent(
      {
        role: "user",
        content: question,
      },
    );

    const extractedAnswer = result.answer;

    await Chat.create({
      question : question,
      answer : extractedAnswer,
      threadId : extractedThreadId,
      Time : new Date()
    })

    return res.status(200).json({result,extractedThreadId});
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }

});