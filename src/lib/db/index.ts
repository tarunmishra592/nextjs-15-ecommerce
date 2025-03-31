import mongoose from 'mongoose'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
    DATABASE_URL = process.env.DATABASE_URL
) => {

  if (cached.conn) return cached.conn

  if (!DATABASE_URL) throw new Error('DATABASE URL is missing')
  cached.promise = cached.promise || mongoose.connect(DATABASE_URL)

  cached.conn = await cached.promise
  console.log(cached)

  console.log('connection success')
  return cached.conn
}