"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bumpCacheVersion = exports.getCacheVersion = void 0;
const upstashRedisRest_1 = require("./upstashRedisRest");
const VERSION_PREFIX = "v";
/**
 * Get cache version (safe fallback)
 */
const getCacheVersion = async (domain) => {
    const key = `${VERSION_PREFIX}:${domain}`;
    try {
        const value = await (0, upstashRedisRest_1.upstashGet)(key);
        return value ? Number(value) : 1;
    }
    catch (error) {
        // ✅ Redis failure should NOT break app
        console.warn(`Cache GET failed for ${domain}, using fallback version`);
        return 1;
    }
};
exports.getCacheVersion = getCacheVersion;
/**
 * Atomic version increment (non-blocking)
 */
const bumpCacheVersion = async (domain) => {
    const key = `${VERSION_PREFIX}:${domain}`;
    console.log(`Bumping cache version for: ${domain}`, key); // Add this
    try {
        // ✅ Atomic increment (NO race condition)
        await (0, upstashRedisRest_1.upstashIncr)(key);
    }
    catch (error) {
        // ✅ Do NOT block main flow
        console.warn(`Cache version bump failed for ${domain}`);
    }
};
exports.bumpCacheVersion = bumpCacheVersion;
