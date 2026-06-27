"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentRouter = void 0;
const agent_1 = require("@/Rag/Agent/agent");
const express_1 = require("express");
const chatModel_1 = require("@/Models/chatModel");
const memory_1 = require("@/Rag/Agent/memory");
exports.agentRouter = (0, express_1.Router)();
exports.agentRouter.post("/chat", async (req, res) => {
    try {
        const { question, threadId } = req.body;
        const extractedThreadId = await (0, memory_1.ensureThreadId)(threadId);
        const result = await (0, agent_1.runProductAgent)([
            {
                role: "user",
                content: question,
            },
        ]);
        const extractedAnswer = result.answer;
        await chatModel_1.Chat.create({
            question: question,
            answer: extractedAnswer,
            threadId: extractedThreadId,
            Time: new Date()
        });
        return res.status(200).json({ result, extractedThreadId });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});
