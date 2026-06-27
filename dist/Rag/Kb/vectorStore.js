"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKbCollection = getKbCollection;
exports.getVectorStore = getVectorStore;
const mongodb_1 = require("@langchain/mongodb");
const mongodb_2 = require("@/Shared/mongodb");
const openai_1 = require("@/Shared/openai");
const KB_COLLECTION_NAME = 'portfolio_chunks';
const KB_INDEX_NAME = 'kb_vector_index';
let cachedCollection = null;
let cachedVectorStore = null;
/**
 * Retrieves and caches the native MongoDB Collection for the Knowledge Base.
 */
async function getKbCollection() {
    if (!cachedCollection) {
        const db = await (0, mongodb_2.getDb)();
        cachedCollection = db.collection(KB_COLLECTION_NAME);
    }
    return cachedCollection;
}
/**
 * Retrieves and caches the LangChain MongoDB Atlas Vector Search instance.
 */
async function getVectorStore() {
    if (!cachedVectorStore) {
        const collection = await getKbCollection();
        cachedVectorStore = new mongodb_1.MongoDBAtlasVectorSearch(openai_1.embeddings, {
            collection: collection,
            indexName: KB_INDEX_NAME,
            textKey: 'text',
            embeddingKey: 'embedding'
        });
    }
    return cachedVectorStore;
}
