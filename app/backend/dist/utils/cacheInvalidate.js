"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateRedisByPrefix = void 0;
const upstashRedisRest_1 = require("./upstashRedisRest");
const invalidateRedisByPrefix = async (prefix) => {
    const url = `${process.env.UPSTASH_REDIS_REST_URL}/keys/${encodeURIComponent(prefix + "*")}`;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
    });
    if (!res.ok)
        return;
    const data = await res.json();
    const keys = data?.result || [];
    if (keys.length) {
        await Promise.all(keys.map((k) => (0, upstashRedisRest_1.upstashDelete)(k)));
    }
};
exports.invalidateRedisByPrefix = invalidateRedisByPrefix;
