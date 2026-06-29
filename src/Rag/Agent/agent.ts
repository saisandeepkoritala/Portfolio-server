import { z } from 'zod';
import { createAgent, toolStrategy } from 'langchain';
import { chatModel } from '@/Shared/openai';
import { agentTools } from '@/Rag/Agent/tools';
import { POLICY_TEXT } from '@/Rag/Agent/policy';
import { handleUserMessage } from '@/Rag/Agent/checkIfGreet';

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

export async function runProductAgent(messages: { role: string, content: string }) {
    try {

        const {role,content} = messages;

        const { text, isGreet } = handleUserMessage(content);
        if (isGreet) return { answer: text, citations: [] };
        
        const newMessageToModel = { role: role, content: text };

        const result = await ProductAgent.invoke(
            { messages : [newMessageToModel] },
            { recursionLimit: 5 }
        );
        
        if (result?.structuredResponse) {
            return {
                answer: result.structuredResponse.answer,
                citations: result.structuredResponse.citations || []
            };
        } else {
            return {
                answer: "Something went wrong.........",
                citations: []
            };
        }
    } 
    catch (error) {
        console.error("Agent hit a recursion path limit or runtime error:", error);
    }
    return {
        answer: "I hit a small reasoning loop while reading my documents. Could you please rephrase your question slightly?",
        citations: []
    };
}