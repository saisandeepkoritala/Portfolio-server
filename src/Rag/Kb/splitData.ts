import { Document } from "@langchain/classic/document";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 150;


export async function splitDocumentsIntoChunks(docs : Document[])
 : Promise<Document[]>{

    if(!docs.length) return [];

    const splitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: CHUNK_OVERLAP,
        chunkSize : CHUNK_SIZE
    });

    const chunks = await splitter.splitDocuments(docs);

    return chunks.map((chunk,index)=>{
        const metadata = chunk?.metadata ?? {};

        return new Document({
            pageContent : chunk.pageContent.trim(),
            metadata : {
                ...metadata,
                source : metadata?.source ?? 'Unknown source',
                _chunkIndex :  index
            }
        });
    })
};