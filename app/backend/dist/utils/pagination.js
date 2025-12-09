"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursorPaginate = cursorPaginate;
const upstashRedisRest_1 = require("./upstashRedisRest");
const memoryCache = new Map();
const MEMORY_CACHE_TTL = 30000; // 30 seconds
const MAX_MEMORY_ENTRIES = 1000;
async function cursorPaginate(prisma, options, cursor, extraWhere // ✅ separate where for filters
) {
    const { model, cursorField = "id", limit = 50, cacheExpiry = 3600, select, } = options;
    const cacheKey = `p:${String(model).slice(0, 3)}:c:${cursor || "0"}:l:${limit}`;
    // Memory cache
    const memoryHit = memoryCache.get(cacheKey);
    if (memoryHit && Date.now() - memoryHit.timestamp < MEMORY_CACHE_TTL) {
        return memoryHit;
    }
    // Redis
    const redisData = await (0, upstashRedisRest_1.upstashGet)(cacheKey);
    if (redisData) {
        const parsed = JSON.parse(redisData);
        memoryCache.set(cacheKey, { ...parsed, timestamp: Date.now() });
        return parsed;
    }
    // DB query
    const data = await prisma[model].findMany({
        where: {
            ...(extraWhere || {}),
            ...(cursor ? { [cursorField]: { gt: cursor } } : {}),
        },
        take: limit + 1,
        orderBy: { [cursorField]: "asc" },
        select,
    });
    const hasMore = data.length > limit;
    const results = hasMore ? data.slice(0, -1) : data;
    const nextCursor = hasMore ? data[limit - 1][cursorField] : null;
    // Cache
    const cachePayload = JSON.stringify({ data: results, nextCursor });
    Promise.all([
        (0, upstashRedisRest_1.upstashSet)(cacheKey, cachePayload, cacheExpiry),
        new Promise(() => {
            memoryCache.set(cacheKey, {
                data: results,
                nextCursor,
                timestamp: Date.now(),
            });
            if (memoryCache.size > MAX_MEMORY_ENTRIES) {
                const firstKey = memoryCache.keys().next().value;
                if (typeof firstKey === "string")
                    memoryCache.delete(firstKey);
            }
        }),
    ]).catch((e) => console.error("Caching failed:", e));
    return { data: results, nextCursor };
}
