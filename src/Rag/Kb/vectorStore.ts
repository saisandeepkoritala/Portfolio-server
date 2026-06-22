import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { getDb } from "@/Shared/mongodb";
import { embeddings } from "@/Shared/openai";
import { Collection } from "mongodb";

const KB_COLLECTION_NAME = 'portfolio_chunks';
const KB_INDEX_NAME = 'kb_vector_index';

let cachedCollection: Collection | null = null;
let cachedVectorStore: MongoDBAtlasVectorSearch | null = null;

/**
 * Retrieves and caches the native MongoDB Collection for the Knowledge Base.
 */
export async function getKbCollection(): Promise<Collection> {
    if (!cachedCollection) {
        const db = await getDb();
        cachedCollection = db.collection(KB_COLLECTION_NAME);
    }
    return cachedCollection;
}

/**
 * Retrieves and caches the LangChain MongoDB Atlas Vector Search instance.
 */
export async function getVectorStore(): Promise<MongoDBAtlasVectorSearch> {
    if (!cachedVectorStore) {
        const collection = await getKbCollection();

        cachedVectorStore = new MongoDBAtlasVectorSearch(embeddings, {
            collection: collection as any,
            indexName: KB_INDEX_NAME,
            textKey: 'text',
            embeddingKey: 'embedding'
        });
    }
    return cachedVectorStore;
}