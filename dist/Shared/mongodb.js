"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoClient = getMongoClient;
exports.getDb = getDb;
const mongodb_1 = require("mongodb");
const env_1 = require("./env");
let client = null;
let db = null;
/**
 * Retrieves and caches the native MongoClient instance for LangChain.
 */
async function getMongoClient() {
    if (!client) {
        client = new mongodb_1.MongoClient(env_1.env.DATABASE_URI);
        await client.connect();
        console.log("MongoClient Connected securely");
    }
    return client;
}
/**
 * Retrieves and caches the native Db instance.
 */
async function getDb() {
    if (!db) {
        const nativeClient = await getMongoClient();
        db = nativeClient.db(env_1.env.DATABASE_NAME);
    }
    return db;
}
