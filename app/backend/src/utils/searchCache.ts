import { PrismaClient } from "@prisma/client";
import { upstashGet, upstashSet } from "./upstashRedisRest";

interface SearchConfig {
  tableName: string;
  exactFields: string[]; // Fields for exact matching (=)
  prefixFields: string[]; // Fields for prefix matching (LIKE 'term%')
  similarFields: string[]; // Fields for similarity matching (ILIKE '%term%')
  cacheKeyPrefix: string;
  sortField?: string;
  maxResults?: number; // Optional limit for results

  relations?: Record<string, string[]>;
  include?: Record<string, boolean>;
}

export const createSearchService = (
  prisma: PrismaClient,
  config: SearchConfig
) => {
  // Cache setup (identical to your original)
  const memoryCache = new Map<string, { data: any[]; timestamp: number }>();
  const MEMORY_CACHE_TTL = 15000; // 15 seconds
  const MAX_MEMORY_CACHE = 500;

  return async (searchTerm: string): Promise<any[]> => {
    const start = performance.now();
    const normalizedTerm = searchTerm.trim().toLowerCase();

    // Validate input
    if (normalizedTerm.length < 2) return [];

    // Cache operations
    const cacheKey = `${config.cacheKeyPrefix}:${normalizedTerm}`;

    // 1. Check memory cache
    const memoryEntry = memoryCache.get(cacheKey);
    if (memoryEntry && Date.now() - memoryEntry.timestamp < MEMORY_CACHE_TTL) {
      return memoryEntry.data;
    }

    // 2. Check Redis with timeout
    try {
      const redisResult = await Promise.race([
        upstashGet(cacheKey),
        new Promise((resolve) => setTimeout(() => resolve(null), 5)),
      ]);

      if (typeof redisResult === "string") {
        const data = JSON.parse(redisResult);
        memoryCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
        return data;
      }
    } catch (error) {
      console.error("Redis cache check failed:", error);
    }

    // 3. Build dynamic query with field-specific conditions
    const queryParts = [];

    // Exact matches (highest priority)
    if (config.exactFields.length > 0) {
      queryParts.push(`
        SELECT *, 1 as priority FROM "${config.tableName}"
        WHERE ${config.exactFields
          .map((f) => `"${f}" = '${normalizedTerm}'`)
          .join(" OR ")}
      `);
    }

    // Prefix matches
    if (config.prefixFields.length > 0) {
      queryParts.push(`
        SELECT *, 2 as priority FROM "${config.tableName}"
        WHERE ${config.prefixFields
          .map((f) => `"${f}" LIKE '${normalizedTerm}%'`)
          .join(" OR ")}
      `);
    }

    // Similarity matches (last resort)
    if (config.similarFields.length > 0) {
      queryParts.push(`
        SELECT *, 3 as priority FROM "${config.tableName}"
        WHERE ${config.similarFields
          .map((f) => `"${f}" ILIKE '%${normalizedTerm}%'`)
          .join(" OR ")}
      `);
    }

    const limitClause = config.maxResults ? `LIMIT ${config.maxResults}` : "";

    const query = `
  SELECT DISTINCT ON ("id") *
  FROM (
    ${queryParts.join(" UNION ALL ")}
  ) AS combined
  ORDER BY "id", priority ASC, "${config.sortField || "createdAt"}" DESC
  ${config.maxResults ? `LIMIT ${config.maxResults}` : ""}
`;

    // 4. Execute query
    let results: any[] = [];
    try {
      results = await prisma.$queryRawUnsafe<any[]>(query);
    } catch (error) {
      console.error("Database query failed:", error);
      throw error;
    }

    const duration = performance.now() - start;
    if (duration > 100) {
      console.log(`Search "${normalizedTerm}" took ${duration.toFixed(2)}ms`);
    }

    // 5. Update caches if results found
    if (results.length > 0) {
      // Memory cache (with LRU eviction)
      if (memoryCache.size >= MAX_MEMORY_CACHE) {
        const oldestKey = [...memoryCache.entries()].reduce((a, b) =>
          a[1].timestamp < b[1].timestamp ? a : b
        )[0];
        memoryCache.delete(oldestKey);
      }
      memoryCache.set(cacheKey, { data: results, timestamp: Date.now() });

      // Redis cache (async)
      upstashSet(cacheKey, JSON.stringify(results), 300).catch((e) =>
        console.error("Redis update failed:", e)
      );
    }

    return results;
  };
};
