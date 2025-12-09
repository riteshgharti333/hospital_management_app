"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: 'redis://localhost:6379',
});
redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('✅ Redis connected');
    }
};
exports.connectRedis = connectRedis;
exports.default = redisClient;
