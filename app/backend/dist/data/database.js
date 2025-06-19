"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URL;
        if (!MONGO_URI) {
            throw new Error('❌ MONGODB_URL is not defined in .env');
        }
        await mongoose_1.default.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully!');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
