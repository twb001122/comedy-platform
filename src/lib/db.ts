import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/comedy-platform';

/**
 * 全局变量用于缓存数据库连接
 */
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose;
}

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * 连接到数据库
 */
export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

export { connectToDatabase as connectDB }; 