import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGODB_URL;

    if (!MONGO_URI) {
      throw new Error('❌ MONGODB_URL is not defined in .env');
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); 
  }
};
