import { Document } from "@langchain/core/documents";
import { getVectorStore } from "./vectorStore";

export interface RetrieverResult {
    docs : Document[],
    confidence : number
};

export async function retreiveRelevantChunks
(query : string, k : number=5) : Promise<RetrieverResult>{

    if(!query.trim()){
        return {
            docs:[],
            confidence : 0
        }
    }

    const vectorstore = await getVectorStore();

    const results = await vectorstore.similaritySearchWithScore(query,k);

    if(!results?.length){
        return {
            docs:[],
            confidence : 0
        }
    }
    const docs = results.map(([doc])=>doc);
    const scores = results.map(([__,score])=>score);
    const best = Math.min(...scores);
    const normalized = Math.max(0,Math.min(1,best));
    const confidence = Number(normalized.toFixed(2));

    return {
        docs,
        confidence
    };

};