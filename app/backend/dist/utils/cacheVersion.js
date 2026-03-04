"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bumpCacheVersion = exports.getCacheVersion = void 0;
const upstashRedisRest_1 = require("./upstashRedisRest");
const VERSION_PREFIX = "v";
const getCacheVersion = async (domain) => {
    const key = `${VERSION_PREFIX}:${domain}`;
    const value = await (0, upstashRedisRest_1.upstashGet)(key);
    return value ? Number(value) : 1;
};
exports.getCacheVersion = getCacheVersion;
const bumpCacheVersion = async (domain) => {
    const key = `${VERSION_PREFIX}:${domain}`;
    const current = await (0, exports.getCacheVersion)(domain);
    await (0, upstashRedisRest_1.upstashSet)(key, String(current + 1));
};
exports.bumpCacheVersion = bumpCacheVersion;
