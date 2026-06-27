"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationsCollection = getConversationsCollection;
exports.ensureThreadId = ensureThreadId;
exports.getHistory = getHistory;
exports.appendToHistory = appendToHistory;
const mongodb_1 = require("@/Shared/mongodb");
const nanoid_1 = require("nanoid");
;
;
const conversation_collection = 'conversations';
let convCollectionPromise = null;
function getConversationsCollection() {
    if (!convCollectionPromise) {
        // We assign the execution promise directly to the cache variable
        convCollectionPromise = (async () => {
            const db = await (0, mongodb_1.getDb)();
            const col = db.collection(conversation_collection);
            await col.createIndex({ threadId: 1 }, { unique: true });
            return col;
        })();
    }
    // convCollectionPromise is guaranteed to be a Promise here, satisfying the return type
    return convCollectionPromise;
}
async function ensureThreadId(isThreadIdPresent) {
    const col = await getConversationsCollection();
    if (isThreadIdPresent) {
        const existing = await col.findOne({ threadId: isThreadIdPresent });
        if (existing)
            return isThreadIdPresent;
    }
    const threadId = (0, nanoid_1.nanoid)(12);
    const now = new Date();
    await col.insertOne({
        threadId,
        messages: [],
        createdAt: now,
        updatedAt: now
    });
    return threadId;
}
;
async function getHistory(threadId) {
    const col = await getConversationsCollection();
    const conv = await col.findOne({ threadId });
    if (!conv)
        return [];
    return conv.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
    }));
}
;
async function appendToHistory(threadId, ...messages) {
    if (!messages.length)
        return;
    const col = await getConversationsCollection();
    // Double verifying message types we recieve.
    const messagesWithTs = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
    }));
    await col.updateOne({ threadId }, {
        $push: {
            messages: {
                $each: messagesWithTs
            }
        },
        $set: {
            updatedAt: new Date()
        }
    });
}
;
