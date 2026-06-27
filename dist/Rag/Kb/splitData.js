"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitDocumentsIntoChunks = splitDocumentsIntoChunks;
const document_1 = require("@langchain/classic/document");
const textsplitters_1 = require("@langchain/textsplitters");
const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 150;
async function splitDocumentsIntoChunks(docs) {
    if (!docs.length)
        return [];
    const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
        chunkOverlap: CHUNK_OVERLAP,
        chunkSize: CHUNK_SIZE
    });
    const chunks = await splitter.splitDocuments(docs);
    return chunks.map((chunk, index) => {
        const metadata = chunk?.metadata ?? {};
        return new document_1.Document({
            pageContent: chunk.pageContent.trim(),
            metadata: {
                ...metadata,
                source: metadata?.source ?? 'Unknown source',
                _chunkIndex: index
            }
        });
    });
}
;
