import { Router, Request, Response } from "express";
import { runProductAgent } from "@/Rag/Agent/agent";
import { ensureThreadId, getHistory, appendToHistory } from "@/Rag/Agent/memory"; 

export const agentRouter = Router();

interface ChatRequestBody {
  question: string;
  threadId?: string;
}

agentRouter.post("/chat", async (req: Request, res: Response) => {
  try {
    const { question, threadId } = req.body as ChatRequestBody;

    // 1. Fetch or generate the correct thread ID
    const extractedThreadId = await ensureThreadId(threadId);

    // 2. Fetch past conversation history
    const history = await getHistory(extractedThreadId);

    // 3. Define the new user message object
    const userMessage = { role: "user" as const, content: question };

    // 4. Run your agent
    const result = await runProductAgent(history, userMessage, extractedThreadId);
    const extractedAnswer = result.answer;

    const assistantMessage = { role: "assistant" as const, content: extractedAnswer };

    // 5. Save BOTH messages into the running thread history
    await appendToHistory(extractedThreadId, userMessage, assistantMessage);

    // 6. Return the result and the thread ID back to the user
    return res.status(200).json({ result, threadId: extractedThreadId });
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", details: err });
  }
});