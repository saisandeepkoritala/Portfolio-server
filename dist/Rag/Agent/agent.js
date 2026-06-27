"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAgent = void 0;
exports.runProductAgent = runProductAgent;
const zod_1 = require("zod");
const langchain_1 = require("langchain");
const openai_1 = require("@/Shared/openai");
const tools_1 = require("./tools");
const policy_1 = require("./policy");
// The strict structured schema output expected by your frontend portfolio
const AgentResponseSchema = zod_1.z.object({
    answer: zod_1.z.string(),
    citations: zod_1.z.array(zod_1.z.object({
        source: zod_1.z.string(),
        chunkId: zod_1.z.number(),
        preview: zod_1.z.string()
    })),
});
// GuardRails
const SYSTEM_PROMPT_WITH_ROUTING = `${policy_1.POLICY_TEXT}`;
exports.ProductAgent = (0, langchain_1.createAgent)({
    model: openai_1.chatModel,
    tools: tools_1.agentTools,
    systemPrompt: SYSTEM_PROMPT_WITH_ROUTING,
    responseFormat: (0, langchain_1.toolStrategy)(AgentResponseSchema)
});
async function runProductAgent(messages) {
    try {
        const result = await exports.ProductAgent.invoke({ messages }, { recursionLimit: 5 });
        if (result?.structuredResponse) {
            return {
                answer: result.structuredResponse.answer,
                citations: result.structuredResponse.citations || []
            };
        }
        else {
            // Can try one shot repair.
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
