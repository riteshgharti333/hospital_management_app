"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPrescriptions = void 0;
const prisma_1 = require("../lib/prisma");
const upstashRedisRest_1 = require("../utils/upstashRedisRest");
// Reuse your cache configuration
const memoryCache = new Map();
const MEMORY_CACHE_TTL = 15000;
const MAX_MEMORY_CACHE = 500;
const searchPrescriptions = async (searchTerm) => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (normalizedTerm.length < 2)
        return [];
    // Cache key
    const cacheKey = `prescription:search:${normalizedTerm}`;
    // 1. Check memory cache
    const memoryEntry = memoryCache.get(cacheKey);
    if (memoryEntry && Date.now() - memoryEntry.timestamp < MEMORY_CACHE_TTL) {
        return memoryEntry.data;
    }
    // 2. Check Redis
    try {
        const redisResult = await Promise.race([
            (0, upstashRedisRest_1.upstashGet)(cacheKey),
            new Promise((resolve) => setTimeout(() => resolve(null), 5)),
        ]);
        if (redisResult) {
            const data = JSON.parse(redisResult);
            memoryCache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
        }
    }
    catch (error) {
        console.error("Redis error:", error);
    }
    // 3. Build and execute search query
    const results = await prisma_1.prisma.prescription.findMany({
        where: {
            OR: [
                { patient: { fullName: { contains: normalizedTerm, mode: 'insensitive' } } },
                { doctor: { fullName: { contains: normalizedTerm, mode: 'insensitive' } } }
            ]
        },
        include: {
            patient: true,
            doctor: true,
            medicines: true
        },
        orderBy: { prescriptionDate: 'desc' }
    });
    // 4. Update caches
    if (results.length > 0) {
        if (memoryCache.size >= MAX_MEMORY_CACHE) {
            const oldestKey = [...memoryCache.entries()].reduce((a, b) => a[1].timestamp < b[1].timestamp ? a : b)[0];
            memoryCache.delete(oldestKey);
        }
        memoryCache.set(cacheKey, { data: results, timestamp: Date.now() });
        (0, upstashRedisRest_1.upstashSet)(cacheKey, JSON.stringify(results), 300).catch(console.error);
    }
    return results;
};
exports.searchPrescriptions = searchPrescriptions;
