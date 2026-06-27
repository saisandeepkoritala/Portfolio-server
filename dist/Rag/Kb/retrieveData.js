"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retreiveRelevantChunks = retreiveRelevantChunks;
const vectorStore_1 = require("./vectorStore");
;
async function retreiveRelevantChunks(query, k = 5) {
    if (!query.trim()) {
        return {
            docs: [],
            confidence: 0
        };
    }
    const vectorstore = await (0, vectorStore_1.getVectorStore)();
    const results = await vectorstore.similaritySearchWithScore(query, k);
    if (!results?.length) {
        return {
            docs: [],
            confidence: 0
        };
    }
    const docs = results.map(([doc]) => doc);
    const scores = results.map(([__, score]) => score);
    const best = Math.min(...scores);
    const normalized = Math.max(0, Math.min(1, best));
    const confidence = Number(normalized.toFixed(2));
    return {
        docs,
        confidence
    };
}
;
