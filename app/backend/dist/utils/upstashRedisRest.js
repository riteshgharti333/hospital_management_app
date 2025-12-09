"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upstashSet = upstashSet;
exports.upstashGet = upstashGet;
exports.upstashDelete = upstashDelete;
// utils/upstashRedisRest.ts
const REDIS_TIMEOUT = 1000; // 1s fetch timeout
const MAX_RETRIES = 2;
const COOLDOWN_MS = 10000; // disable Redis for 10s after repeated failures
let redisHealthy = true;
let lastRedisFailTime = 0;
/** Retry wrapper with small backoff */
async function withRetry(fn, retries = MAX_RETRIES) {
    let lastErr;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (err) {
            lastErr = err;
            await new Promise((r) => setTimeout(r, 100 * (i + 1)));
        }
    }
    throw lastErr;
}
/** Health check + cooldown */
function isRedisAvailable() {
    if (!redisHealthy) {
        const now = Date.now();
        if (now - lastRedisFailTime > COOLDOWN_MS) {
            redisHealthy = true;
        }
        else {
            return false;
        }
    }
    return true;
}
async function handleFailure(error, op) {
    redisHealthy = false;
    lastRedisFailTime = Date.now();
    console.warn(`[Redis ${op}] temporarily disabled due to errors:`, error?.message || error);
}
/** Redis SET */
async function upstashSet(key, value, expireSeconds) {
    if (!isRedisAvailable() || typeof key !== "string" || key.length === 0)
        return;
    try {
        const stringValue = typeof value === "string" ? value : JSON.stringify(value);
        const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(stringValue)}${expireSeconds ? `?ex=${expireSeconds}` : ""}`;
        await withRetry(() => fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
                "Content-Type": "application/json",
                Connection: "keep-alive",
            },
        }));
    }
    catch (error) {
        await handleFailure(error, "SET");
    }
}
/** Redis GET */
async function upstashGet(key) {
    if (!isRedisAvailable() || typeof key !== "string")
        return null;
    try {
        const response = await withRetry(() => fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
                Connection: "keep-alive",
            },
        }));
        if (!response.ok)
            throw new Error(`Redis GET failed with status ${response.status}`);
        const data = await response.json();
        return data?.result ?? null;
    }
    catch (error) {
        await handleFailure(error, "GET");
        return null;
    }
}
/** Redis DELETE */
async function upstashDelete(key) {
    if (!isRedisAvailable() || typeof key !== "string" || key.length === 0)
        return;
    try {
        const url = `${process.env.UPSTASH_REDIS_REST_URL}/del/${encodeURIComponent(key)}`;
        await withRetry(() => fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
                "Content-Type": "application/json",
                Connection: "keep-alive",
            },
        }));
    }
    catch (error) {
        await handleFailure(error, "DELETE");
    }
}
