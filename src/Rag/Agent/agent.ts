import { z } from 'zod';
import { createAgent, toolStrategy } from 'langchain';
import { chatModel } from '@/Shared/openai';
import { agentTools } from './tools';
import { POLICY_TEXT } from './policy';

// The strict structured schema output expected by your frontend portfolio
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

// GuardRails
const SYSTEM_PROMPT_WITH_ROUTING = `${POLICY_TEXT}`;

export const ProductAgent = createAgent({
    model: chatModel,
    tools: agentTools,
    systemPrompt: SYSTEM_PROMPT_WITH_ROUTING,
    responseFormat: toolStrategy(AgentResponseSchema)
});

export async function runProductAgent(
    messages: { role: string, content: string }[]
) {
    try {
        const result = await ProductAgent.invoke(
            { messages },
            { recursionLimit: 5 }
        );
        if (result?.structuredResponse) {
            return {
                answer: result.structuredResponse.answer,
                citations: result.structuredResponse.citations || []
            };
        }
        else{
            // Can try one shot repair.
            return {
                answer: "Something went wrong.........",
                citations: []
                }
        }
    } catch (error) {
        console.error("Agent hit a recursion path limit or runtime error:", error);
    }
    return {
        answer: "I hit a small reasoning loop while reading my documents. Could you please rephrase your question slightly?",
        citations: []
    };
}