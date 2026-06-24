import {z} from 'zod';
import { createAgent, toolStrategy } from 'langchain';
import { chatModel } from '@/Shared/openai';
import { agentTools } from './tools';
import { POLICY_TEXT } from './policy';

const AgentResponseSchema = z.object({
    answer  : z.string(),
    citations : z.array(
        z.object({
            source : z.string(),
            chunkId : z.number(),
            preview : z.string()
        })
    ),
});

export const ProductAgent  = createAgent({
    model : chatModel,
    tools : agentTools,
    systemPrompt : POLICY_TEXT,
    responseFormat : toolStrategy(AgentResponseSchema)
});

export async function runProductAgent(
    messages : {role:string,content:string}[]
){
    const result : any = await ProductAgent.invoke({messages});

    if(result?.structuredResponse){
        return {
            answer : result?.structuredResponse?.answer,
            citations : result?.structuredResponse?.citations
        }
    }

    return {
        answer : '',
        citations : []
    }
};

