"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = exports.embeddings = void 0;
const openai_1 = require("@langchain/openai");
const env_1 = require("@/Shared/env");
exports.embeddings = new openai_1.OpenAIEmbeddings({
    model: 'text-embedding-3-small',
    openAIApiKey: env_1.env.OPENAI_API_KEY
});
exports.chatModel = new openai_1.ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    openAIApiKey: env_1.env.OPENAI_API_KEY
});
