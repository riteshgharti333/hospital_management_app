"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDashboardCache = withDashboardCache;
const upstashRedisRest_1 = require("./upstashRedisRest");
const DEFAULT_TTL = 5 * 60; // 5 minutes
async function withDashboardCache({ key, ttlSeconds = DEFAULT_TTL, fetcher, }) {
    // 1️⃣ Try Redis
    const cached = await (0, upstashRedisRest_1.upstashGet)(key);
    if (cached) {
        return JSON.parse(cached);
    }
    // 2️⃣ Fetch from DB
    const data = await fetcher();
    // 3️⃣ Store in cache (fire & forget)
    (0, upstashRedisRest_1.upstashSet)(key, data, ttlSeconds).catch(() => { });
    return data;
}
