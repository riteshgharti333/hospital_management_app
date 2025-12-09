"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSearchService = void 0;
const upstashRedisRest_1 = require("./upstashRedisRest");
const createSearchService = (prisma, config) => {
    const memoryCache = new Map();
    const MEMORY_CACHE_TTL = 15000;
    const MAX_MEMORY_CACHE = 500;
    return async (searchTerm) => {
        const start = performance.now();
        const normalizedTerm = searchTerm.trim().toLowerCase();
        if (normalizedTerm.length < 2)
            return [];
        const cacheKey = `${config.cacheKeyPrefix}:${normalizedTerm}`;
        // 1. memory cache
        const memoryEntry = memoryCache.get(cacheKey);
        if (memoryEntry && Date.now() - memoryEntry.timestamp < MEMORY_CACHE_TTL) {
            return memoryEntry.data;
        }
        // 2. redis cache (short timeout)
        try {
            const redisResult = await Promise.race([
                (0, upstashRedisRest_1.upstashGet)(cacheKey),
                new Promise((resolve) => setTimeout(() => resolve(null), 5)),
            ]);
            if (typeof redisResult === "string") {
                const data = JSON.parse(redisResult);
                memoryCache.set(cacheKey, { data, timestamp: Date.now() });
                return data;
            }
        }
        catch (error) {
            console.error("Redis cache check failed:", error);
        }
        // 3. Build a dynamic, reusable ranked query using config
        // We'll always pass 3 params for simplicity:
        //  $1 -> normalizedTerm (exact)
        //  $2 -> normalizedTerm% (prefix)
        //  $3 -> normalizedTerm (similarity)
        const values = [
            normalizedTerm,
            `${normalizedTerm}%`,
            normalizedTerm,
        ];
        // Build pieces conditionally based on provided fields
        const escapeField = (f) => `"${f}"`; // minimal quoting; keep consistent with your schema
        // Exact conditions (LOWER(field) = $1)
        const exactConditions = config.exactFields && config.exactFields.length > 0
            ? config.exactFields
                .map((f) => `LOWER(${escapeField(f)}) = $1`)
                .join(" OR ")
            : "";
        // Prefix conditions (LOWER(field) LIKE $2)
        const prefixConditions = config.prefixFields && config.prefixFields.length > 0
            ? config.prefixFields
                .map((f) => `LOWER(${escapeField(f)}) LIKE $2`)
                .join(" OR ")
            : "";
        // Similar/fuzzy conditions using pg_trgm % operator (LOWER(field) % $3)
        const similarConditions = config.similarFields && config.similarFields.length > 0
            ? config.similarFields
                .map((f) => `LOWER(${escapeField(f)}) % $3`)
                .join(" OR ")
            : "";
        // Compose WHERE clause from available parts
        const whereParts = [];
        if (exactConditions)
            whereParts.push(`(${exactConditions})`);
        if (prefixConditions)
            whereParts.push(`(${prefixConditions})`);
        if (similarConditions)
            whereParts.push(`(${similarConditions})`);
        // If nothing provided in config, return empty (avoid full table scans)
        if (whereParts.length === 0) {
            return [];
        }
        const whereClause = whereParts.join(" OR ");
        // Build CASE ranking: exact -> prefix -> similar
        const caseWhen = [];
        if (exactConditions)
            caseWhen.push(`WHEN ${exactConditions} THEN 1`);
        if (prefixConditions)
            caseWhen.push(`WHEN ${prefixConditions} THEN 2`);
        if (similarConditions)
            caseWhen.push(`WHEN ${similarConditions} THEN 3`);
        caseWhen.push(`ELSE 4`); // fallback
        const caseExpr = `CASE ${caseWhen.join(" ")} END AS priority`;
        // Build rank_score using GREATEST(similarity(...), ...)
        // Use similarity only for fields listed in similarFields. If none, fallback to 0.
        const similarityExpr = config.similarFields && config.similarFields.length > 0
            ? `GREATEST(${config.similarFields
                .map((f) => `similarity(LOWER(${escapeField(f)}), $3)`)
                .join(", ")}) AS rank_score`
            : `0 AS rank_score`;
        // Final query
        const query = `
  SELECT *, ${caseExpr}, ${similarityExpr}
  FROM "${config.tableName}"
  WHERE (${whereClause})
  ORDER BY priority ASC, rank_score DESC, "${config.sortField || "createdAt"}" DESC
  LIMIT ${config.maxResults || 50}                -- Always limit result set
`;
        // 4. Execute
        let results = [];
        try {
            results = await prisma.$queryRawUnsafe(query, ...values);
        }
        catch (error) {
            console.error("Database query failed:", error);
            throw error;
        }
        // 5. logging
        const duration = performance.now() - start;
        if (duration > 100) {
            console.log(`Search "${normalizedTerm}" took ${duration.toFixed(2)}ms`);
        }
        // 6. caching
        if (results.length > 0) {
            if (memoryCache.size >= MAX_MEMORY_CACHE) {
                const oldestKey = [...memoryCache.entries()].reduce((a, b) => a[1].timestamp < b[1].timestamp ? a : b)[0];
                memoryCache.delete(oldestKey);
            }
            memoryCache.set(cacheKey, { data: results, timestamp: Date.now() });
            (0, upstashRedisRest_1.upstashSet)(cacheKey, JSON.stringify(results), 300).catch((e) => console.error("Redis update failed:", e));
        }
        return results;
    };
};
exports.createSearchService = createSearchService;
