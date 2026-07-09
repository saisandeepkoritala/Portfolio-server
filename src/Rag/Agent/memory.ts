import { getDb } from "@/Shared/mongodb";
import { Collection, WithId } from "mongodb";
import { nanoid } from "nanoid";

export type ChatRole =  'user' | 'assistant';

export interface ChatMessage{
    role : ChatRole,
    content : string,
};

export interface ConversationDoc {
    threadId : string,
    messages : {
        role :  ChatRole,
        content : string,
    }[],
    createdAt : Date,
    updatedAt : Date
};

const conversation_collection = 'conversations';

let convCollectionPromise : Promise<Collection<ConversationDoc>> | null = null;

export function getConversationsCollection(): Promise<Collection<ConversationDoc>> {
    if (!convCollectionPromise) {
        // We assign the execution promise directly to the cache variable
        convCollectionPromise = (async () => {
            const db = await getDb();
            const col = db.collection<ConversationDoc>(conversation_collection);
            await col.createIndex({ threadId: 1 }, { unique: true });
            return col;
        })();
    }

    // convCollectionPromise is guaranteed to be a Promise here, satisfying the return type
    return convCollectionPromise;
}

export async function ensureThreadId(isThreadIdPresent ?: string): Promise<string> {
    const col = await getConversationsCollection();

    if (isThreadIdPresent) {
        // Double check if it actually exists in our DB
        const existing = await col.findOne({ threadId: isThreadIdPresent });
        if (existing) return isThreadIdPresent;
    }   

    // Generate a new thread ID if missing or not found in DB
    const threadId = nanoid(12);
    const now = new Date();

    // CRITICAL: Insert the base document structure so it exists for future updates
    await col.insertOne({
        threadId,
        messages: [],
        createdAt: now,
        updatedAt: now
    });

    return threadId;
}

export async function getHistory(threadId: string) {
    const col = await getConversationsCollection();
    const conv = await col.findOne({ threadId });

    if (!conv) return [];

    return conv.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
    }));
}

export async function appendToHistory(threadId: string, ...messages: ChatMessage[]): Promise<void> {
    if (!messages.length) return;

    const col = await getConversationsCollection();

    const messagesWithTs = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
    }));

    await col.updateOne(
        { threadId },
        {
            $push: {
                messages: {
                    $each: messagesWithTs
                }
            },
            $set: {
                updatedAt: new Date()
            }
        }
    );
}

export interface ErrorLogDoc {
    threadId?: string;
    errorName: string;
    errorMessage: string;
    errorStack?: string;
    context?: any;
    timestamp: Date;
}

const error_collection = 'error_logs';

export async function logErrorToDb(error: unknown, threadId?: string, context?: any): Promise<void> {
    try {
        const db = await getDb(); // Assuming getDb() is imported here
        const col = db.collection<ErrorLogDoc>(error_collection);

        const errorObj = error instanceof Error ? error : new Error(String(error));

        await col.insertOne({
            threadId,
            errorName: errorObj.name,
            errorMessage: errorObj.message,
            errorStack: errorObj.stack,
            context: context || null,
            timestamp: new Date()
        });
    } catch (loggingError) {
        // Fallback to console if writing to the database itself fails
        console.error("Failed to write log to MongoDB:", loggingError);
    }
}