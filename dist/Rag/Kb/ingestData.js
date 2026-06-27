"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestDocuments = ingestDocuments;
const documents_1 = require("@langchain/core/documents");
const vectorStore_1 = require("./vectorStore");
;
async function ingestDocuments(namespace, chunks) {
    if (!namespace)
        throw new Error('Namespace is needed');
    if (!chunks.length) {
        return {
            ok: false,
            namespace,
            totalChunks: 0,
            sources: []
        };
    }
    const vectorstore = await (0, vectorStore_1.getVectorStore)();
    let currentId = 0;
    const docsWithMeta = chunks.map((chunk) => {
        const source = chunk?.metadata?.source || 'Unknown_Source';
        const doc = new documents_1.Document({
            pageContent: chunk.pageContent,
            metadata: {
                namespace,
                source,
                chunkId: currentId++,
                isValid: true
            }
        });
        return doc;
    });
    await vectorstore.addDocuments(docsWithMeta);
    const sources = Array.from(new Set(docsWithMeta.map(d => d.metadata.source)));
    return {
        ok: true,
        namespace,
        totalChunks: docsWithMeta.length,
        sources
    };
}
;
