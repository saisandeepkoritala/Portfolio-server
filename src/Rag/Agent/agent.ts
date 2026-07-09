import { z } from 'zod';
import { createAgent, toolStrategy } from 'langchain';
import { chatModel } from '@/Shared/openai';
import { agentTools } from '@/Rag/Agent/tools';
import { POLICY_TEXT } from '@/Rag/Agent/policy';
import { handleUserMessage } from '@/Rag/Agent/checkIfGreet';
import { logErrorToDb } from '@/Rag/Agent/memory'; // 1. Import your new logger

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
    responseFormat: toolStrategy(AgentResponseSchema)
});

// 2. Added optional threadId parameter
export async function runProductAgent(messages: { role: string, content: string }[], threadId?: string) {
    try {
        if (messages.length === 0) {
            return { answer: "No messages provided.", citations: [] };
        }

        // 1. Filter out past loop/error messages so they don't confuse the agent
        const filteredHistory = messages.filter(msg => 
            !msg.content.includes("I hit a small reasoning loop") &&
            !msg.content.includes("Something went wrong")
        );

        if (filteredHistory.length === 0) {
            return { answer: "Hello! How can I help you today?", citations: [] };
        }

        // 2. Grab and clean ONLY the last message
        const lastMessage = filteredHistory[filteredHistory.length - 1];
        const { text, isGreet } = handleUserMessage(lastMessage.content);
        
        if (isGreet) return { answer: text, citations: [] };
        
        // 3. Reconstruct the clean message history
        const cleanedMessages = [
            ...filteredHistory.slice(0, -1),
            { role: lastMessage.role, content: text }
        ];

        // LOG FOR DEBUGGING - Check what the LLM actually receives now
        //console.log("Filtered Messages sent to Agent invoke:", cleanedMessages);

        // 4. Invoke with an increased recursion limit (give tool strategy breathing room)
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
        await logErrorToDb(error, threadId, { userPrompt: messages[messages.length - 1]?.content });
    }

    return {
        answer: "I hit a small reasoning loop while reading my documents. Could you please rephrase your question slightly?",
        citations: []
    };
}