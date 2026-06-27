import { z } from 'zod';
import { tool } from 'langchain';
import { retreiveRelevantChunks } from '@/Rag/Kb/retrieveData';

export const kbSearchTool = tool(
    async ({ question }) => {
        const { docs, confidence } = await retreiveRelevantChunks(question, 5);

        const context = docs.map((doc) => {
            const source = (doc?.metadata?.source as string) || 'Unknown source';

            const chunkId = (doc?.metadata?.chunkId as number) ?? (
                doc?.metadata?._chunkIndex as number
            );

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
    },
    {
        name: 'SaiBioHelper',
        description: 'Search the documentation for relevant answers',
        schema: z.object({
            question: z.string().describe("User's question or follow up that must be answered from docs"),
        }) 
    },
);

export const agentTools = [kbSearchTool];