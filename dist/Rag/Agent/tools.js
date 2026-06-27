"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentTools = exports.kbSearchTool = void 0;
const zod_1 = require("zod");
const langchain_1 = require("langchain");
const retrieveData_1 = require("@/Rag/Kb/retrieveData");
exports.kbSearchTool = (0, langchain_1.tool)(async ({ question }) => {
    const { docs, confidence } = await (0, retrieveData_1.retreiveRelevantChunks)(question, 5);
    const context = docs.map((doc) => {
        const source = doc?.metadata?.source || 'Unknown source';
        const chunkId = doc?.metadata?.chunkId ?? doc?.metadata?._chunkIndex;
        // If needed can trim long documents by cutting pageContent to 400 - 500.
        const preview = doc.pageContent;
        return {
            source,
            chunkId,
            preview
        };
    });
    return JSON.stringify({
        confidence,
        context
    });
}, {
    name: 'SaiBioHelper',
    description: 'Search the documentation for relevant answers',
    schema: zod_1.z.object({
        question: zod_1.z.string().describe("User's question or follow up that must be answered from docs"),
    })
});
exports.agentTools = [exports.kbSearchTool];
