import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Node.js uses public DNS resolvers (Google & Cloudflare) for MongoDB Atlas SRV resolution.
// This prevents Windows local DNS / ISP routers from throwing `querySrv ECONNREFUSED`.
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {
  // Ignore in restricted environments
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add it to .env.local and restart the Next.js server.');
  }

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch(async (error) => {
        // If an SRV lookup error occurred, retry with Cloudflare DNS
        if (error.message && error.message.includes('querySrv')) {
          try {
            dns.setServers(['1.1.1.1', '8.8.8.8']);
            return await mongoose.connect(uri, {
              bufferCommands: false,
              serverSelectionTimeoutMS: 10000,
            });
          } catch (retryErr) {
            cached.promise = null;
            throw new Error(`MongoDB connection failed: ${retryErr.message}`);
          }
        }
        cached.promise = null;
        throw new Error(`MongoDB connection failed: ${error.message}`);
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
