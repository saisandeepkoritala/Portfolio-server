import { z } from 'zod';
import { createAgent, providerStrategy } from 'langchain';
import { chatModel } from '@/Shared/openai';
import { agentTools } from '@/Rag/Agent/tools';
import { POLICY_TEXT } from '@/Rag/Agent/policy';
import { handleUserMessage } from '@/Rag/Agent/checkIfGreet';
import { logErrorToDb } from '@/Rag/Agent/memory';

const AgentResponseSchema = z.object({
    answer: z.string(),
    citations: z.array(
        z.object({
            source: z.string(),
            chunkId: z.number(),
            preview: z.string()
        })
    ),
});

export const ProductAgent = createAgent({
    model: chatModel,
    tools: agentTools,
    systemPrompt: POLICY_TEXT,
    responseFormat: providerStrategy(AgentResponseSchema)
});

export async function runProductAgent(
  history: { role: string; content: string }[], 
  userMessage: { role: string; content: string }, 
  threadId?: string
) {
    try {
        if (userMessage.content.trim() === "") {
            return { answer: "No user message provided.", citations: [] };
        }

        // 1. Filter out past loop/error messages so they don't confuse the agent
        const filteredHistory = history.filter(msg => 
            !msg.content.includes("I hit a small reasoning loop") &&
            !msg.content.includes("Something went wrong")
        );

        // 2. Grab and clean the CURRENT user message
        const { text, isGreet } = handleUserMessage(userMessage.content);
        
        // If the user's initial or current message is just a greeting, handle it immediately
        if (isGreet) {
            return { answer: text, citations: [] };
        }
        
        // 3. Reconstruct the clean message history (Preserve ALL history + append current message)
        const cleanedMessages = [
            ...filteredHistory,
            { role: userMessage.role, content: text }
        ];

        // 4. Invoke Agent
        const result = await ProductAgent.invoke(
            { messages: cleanedMessages }, 
            { recursionLimit: 6 } 
        );
        
        if (result?.structuredResponse) {
            return {
                answer: result.structuredResponse.answer,
                citations: result.structuredResponse.citations || []
            };
        } else {
            await logErrorToDb("Agent returned empty or unstructured response", threadId, { result });
            return {
                answer: "Something went wrong.........",
                citations: []
            };
        }
    } 
    catch (error) {
        console.error("Agent hit a recursion path limit or runtime error:", error);
        // Cast error to 'any' or check type if your database logger requires a specific type
        await logErrorToDb(error as any, threadId, { userPrompt: userMessage.content });
    }

    return {
        answer: "I hit a small reasoning loop while reading my documents. Could you please rephrase your question slightly?",
        citations: []
    };
}