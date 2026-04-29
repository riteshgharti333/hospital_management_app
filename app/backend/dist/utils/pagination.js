"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursorPaginate = cursorPaginate;
const upstashRedisRest_1 = require("./upstashRedisRest");
const cacheVersion_1 = require("./cacheVersion");
const memoryCache = new Map();
console.log(process.env.UPSTASH_REDIS_REST_URL);
const MEMORY_CACHE_TTL = 30000;
const MAX_MEMORY_ENTRIES = 1000;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100; // ✅ prevent abuse
async function cursorPaginate(prisma, options, rawCursor, // ✅ safer input
extraWhere) {
    const { model, cacheExpiry = 3600, select, include, orderBy = [{ createdAt: "desc" }, { id: "desc" }], } = options;
    // ✅ FIX: Normalize model name to lowercase for consistent cache keys
    const modelName = String(model).toLowerCase();
    // ✅ LIMIT CONTROL
    let limit = options.limit ?? DEFAULT_LIMIT;
    if (limit > MAX_LIMIT)
        limit = MAX_LIMIT;
    // ✅ Use normalized modelName for cache version
    const version = await (0, cacheVersion_1.getCacheVersion)(modelName);
    // ✅ SAFE CURSOR
    const cursor = typeof rawCursor === "string" && rawCursor.includes("|")
        ? rawCursor
        : undefined;
    const safeCursor = cursor ? encodeURIComponent(cursor) : "0";
    // ✅ Use normalized modelName in cache key
    const cacheKey = `p:${modelName}:v:${version}:c:${safeCursor}:l:${limit}:o:${encodeURIComponent(JSON.stringify(orderBy))}`;
    // ✅ MEMORY CACHE
    const memoryHit = memoryCache.get(cacheKey);
    if (memoryHit && Date.now() - memoryHit.timestamp < MEMORY_CACHE_TTL) {
        return memoryHit;
    }
    // ✅ REDIS CACHE
    try {
        const redisData = await (0, upstashRedisRest_1.upstashGet)(cacheKey);
        if (redisData) {
            const parsed = JSON.parse(redisData);
            memoryCache.set(cacheKey, { ...parsed, timestamp: Date.now() });
            return parsed;
        }
    }
    catch (e) {
        console.warn("Redis GET failed (safe fallback)");
    }
    if (process.env.NODE_ENV !== "production") {
        console.log("🔥 DB QUERY:", modelName);
    }
    // ✅ SAFE CURSOR PARSING
    let cursorDate = null;
    let cursorId = null;
    if (cursor) {
        const [date, id] = cursor.split("|");
        const parsedDate = new Date(date);
        const parsedId = Number(id);
        if (!isNaN(parsedDate.getTime()) && !isNaN(parsedId)) {
            cursorDate = parsedDate;
            cursorId = parsedId;
        }
        else {
            // invalid cursor → ignore safely
            cursorDate = null;
            cursorId = null;
        }
    }
    // ✅ WHERE CONDITION
    const whereCondition = {
        ...(extraWhere || {}),
        ...(cursorDate !== null && cursorId !== null
            ? {
                OR: [
                    { createdAt: { lt: cursorDate } },
                    {
                        AND: [
                            { createdAt: cursorDate },
                            { id: { lt: cursorId } },
                        ],
                    },
                ],
            }
            : {}),
    };
    // ✅ Keep original 'model' for Prisma query (not modelName)
    const data = await prisma[model].findMany({
        where: whereCondition,
        orderBy,
        take: limit + 1,
        ...(select ? { select } : {}),
        ...(include ? { include } : {}),
    });
    const hasMore = data.length > limit;
    const results = hasMore ? data.slice(0, limit) : data;
    let nextCursor = null;
    if (hasMore && results.length > 0) {
        const lastItem = results[results.length - 1];
        nextCursor = `${lastItem.createdAt.toISOString()}|${lastItem.id}`;
    }
    const response = {
        data: results,
        pagination: {
            nextCursor,
            hasMore,
        },
    };
    const cachePayload = JSON.stringify(response);
    // ✅ SAFE CACHE WRITE
    Promise.all([
        (0, upstashRedisRest_1.upstashSet)(cacheKey, cachePayload, cacheExpiry).catch(() => { }),
        new Promise((resolve) => {
            memoryCache.set(cacheKey, {
                ...response,
                timestamp: Date.now(),
            });
            if (memoryCache.size > MAX_MEMORY_ENTRIES) {
                const firstKey = memoryCache.keys().next().value;
                if (typeof firstKey === "string")
                    memoryCache.delete(firstKey);
            }
            resolve();
        }),
    ]).catch(() => { });
    return response;
}
