import { MongoClient, Db } from "mongodb";
import { env } from "./env";

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Retrieves and caches the native MongoClient instance for LangChain.
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(env.DATABASE_URI);
    await client.connect();
    console.log("MongoClient Connected securely");
  }
  return client;
}

/**
 * Retrieves and caches the native Db instance.
 */
export async function getDb(): Promise<Db> {
  if (!db) {
    const nativeClient = await getMongoClient();
    db = nativeClient.db(env.DATABASE_NAME);
  }
  return db;
}