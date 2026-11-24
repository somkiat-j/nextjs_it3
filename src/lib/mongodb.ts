import "server-only";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not configured");

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};
declare global {
  var mongooseCache: Cache | undefined;
}
const cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;
  if (!cache.promise)
    cache.promise = mongoose.connect(uri, { bufferCommands: false });
  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
  return cache.conn;
}
