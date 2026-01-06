import { PrismaClient } from "@prisma/client";
import { upstashGet, upstashSet } from "./upstashRedisRest";
import { getCacheVersion } from "./cacheVersion";

interface SearchConfig {
  tableName: string;
  exactFields: string[];
  prefixFields: string[];
  similarFields: string[];
  cacheKeyPrefix: string;
  sortField?: string;
  maxResults?: number;
  relations?: Record<string, string[]>;
  include?: Record<string, boolean>;
}

export const createSearchService = (
  prisma: PrismaClient,
  config: SearchConfig
) => {
  const memoryCache = new Map<string, { data: any[]; timestamp: number }>();
  const MEMORY_CACHE_TTL = 5000;
  const MAX_MEMORY_CACHE = 500;

  return async (searchTerm: string): Promise<any[]> => {
    const start = performance.now();
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (normalizedTerm.length < 2) return [];

    // 🔥 NEW: domain version (same as pagination)
    const version = await getCacheVersion(config.cacheKeyPrefix);

    // 🔥 NEW: versioned cache key
    const cacheKey = `${config.cacheKeyPrefix}:v${version}:search:${normalizedTerm}`;

    // 1️⃣ Memory cache
    const memoryEntry = memoryCache.get(cacheKey);
    if (memoryEntry && Date.now() - memoryEntry.timestamp < MEMORY_CACHE_TTL) {
      return memoryEntry.data;
    }

    // 2️⃣ Redis cache
    try {
      const redisResult = await Promise.race([
        upstashGet(cacheKey),
        new Promise((resolve) => setTimeout(() => resolve(null), 5)),
      ]);

      if (typeof redisResult === "string") {
        const data = JSON.parse(redisResult);
        memoryCache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      }
    } catch (error) {
      console.error("Redis cache check failed:", error);
    }

    // 3️⃣ Build ranked SQL query (UNCHANGED)
    const values: any[] = [
      normalizedTerm,
      `${normalizedTerm}%`,
      normalizedTerm,
    ];

    const escapeField = (f: string) => `"${f}"`;

    const exactConditions = config.exactFields.length
      ? config.exactFields
          .map((f) => `LOWER(${escapeField(f)}) = $1`)
          .join(" OR ")
      : "";

    const prefixConditions = config.prefixFields.length
      ? config.prefixFields
          .map((f) => `LOWER(${escapeField(f)}) LIKE $2`)
          .join(" OR ")
      : "";

    const similarConditions = config.similarFields.length
      ? config.similarFields
          .map((f) => `LOWER(${escapeField(f)}) % $3`)
          .join(" OR ")
      : "";

    const whereParts: string[] = [];
    if (exactConditions) whereParts.push(`(${exactConditions})`);
    if (prefixConditions) whereParts.push(`(${prefixConditions})`);
    if (similarConditions) whereParts.push(`(${similarConditions})`);

    if (whereParts.length === 0) return [];

    const whereClause = whereParts.join(" OR ");

    const caseWhen: string[] = [];
    if (exactConditions) caseWhen.push(`WHEN ${exactConditions} THEN 1`);
    if (prefixConditions) caseWhen.push(`WHEN ${prefixConditions} THEN 2`);
    if (similarConditions) caseWhen.push(`WHEN ${similarConditions} THEN 3`);
    caseWhen.push(`ELSE 4`);

    const caseExpr = `CASE ${caseWhen.join(" ")} END AS priority`;

    const similarityExpr = config.similarFields.length
      ? `GREATEST(${config.similarFields
          .map((f) => `similarity(LOWER(${escapeField(f)}), $3)`)
          .join(", ")}) AS rank_score`
      : `0 AS rank_score`;

    const query = `
      SELECT *, ${caseExpr}, ${similarityExpr}
      FROM "${config.tableName}"
      WHERE (${whereClause})
      ORDER BY priority ASC, rank_score DESC, "${
        config.sortField || "createdAt"
      }" DESC
      LIMIT ${config.maxResults || 50}
    `;

    // 4️⃣ Execute DB query
    const results = await prisma.$queryRawUnsafe<any[]>(query, ...values);

    // 5️⃣ Cache results
    if (results.length > 0) {
      if (memoryCache.size >= MAX_MEMORY_CACHE) {
        const oldestKey = [...memoryCache.entries()].reduce((a, b) =>
          a[1].timestamp < b[1].timestamp ? a : b
        )[0];
        memoryCache.delete(oldestKey);
      }

      memoryCache.set(cacheKey, { data: results, timestamp: Date.now() });
      upstashSet(cacheKey, JSON.stringify(results), 300).catch(console.error);
    }

    const duration = performance.now() - start;
    if (duration > 100) {
      console.log(
        `Search "${normalizedTerm}" (v${version}) took ${duration.toFixed(2)}ms`
      );
    }

    return results;
  };
};
