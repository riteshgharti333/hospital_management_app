// utils/pagination.ts
import { PrismaClient } from "@prisma/client";
import { upstashGet, upstashSet } from "./upstashRedisRest";

// In-memory cache layer
const memoryCache = new Map<
  string,
  {
    data: any[];
    nextCursor: string | number | null;
    timestamp: number;
  }
>();
const MEMORY_CACHE_TTL = 30000; // 30 seconds
const MAX_MEMORY_ENTRIES = 1000;

type PaginationOptions<T extends keyof PrismaClient> = {
  model: T;
  cursorField?: string;
  limit?: number;
  cacheExpiry?: number;
  select?: Record<string, boolean>; // Add field selection
};

export async function cursorPaginate<T extends keyof PrismaClient, R = any>(
  prisma: PrismaClient,
  options: PaginationOptions<T>,
  cursor?: string | number
): Promise<{ data: R[]; nextCursor: string | number | null }> {
  const {
    model,
    cursorField = "id",
    limit = 100,
    cacheExpiry = 3600,
    select,
  } = options;

  const cacheKey = `p:${String(model).slice(0, 3)}:c:${
    cursor || "0"
  }:l:${limit}`;

  // 1. Check memory cache first
  const memoryHit = memoryCache.get(cacheKey);
  if (memoryHit && Date.now() - memoryHit.timestamp < MEMORY_CACHE_TTL) {
    return memoryHit;
  }

  // 2. Try Redis
  const redisData = await upstashGet(cacheKey);
  if (redisData) {
    const parsed = JSON.parse(redisData);
    memoryCache.set(cacheKey, { ...parsed, timestamp: Date.now() });
    return parsed;
  }

  // 3. Database query
  const data = await (prisma[model] as any).findMany({
    where: cursor ? { [cursorField]: { gt: cursor } } : {},
    take: limit + 1,
    orderBy: { [cursorField]: "asc" },
    select, // Critical for performance
  });

  // 4. Process results
  const hasMore = data.length > limit;
  const results = hasMore ? data.slice(0, -1) : data;
  const nextCursor = hasMore ? data[limit - 1][cursorField] : null;

  // 5. Cache results (non-blocking)
  const cachePayload = JSON.stringify({ data: results, nextCursor });
  Promise.all([
    upstashSet(cacheKey, cachePayload, cacheExpiry),
    new Promise(() => {
      memoryCache.set(cacheKey, {
        data: results,
        nextCursor,
        timestamp: Date.now(),
      });
      if (memoryCache.size > MAX_MEMORY_ENTRIES) {
        const firstKey = memoryCache.keys().next().value;
        if (typeof firstKey === "string") {
          memoryCache.delete(firstKey);
        }
      }
    }),
  ]).catch((e) => console.error("Caching failed:", e));

  return { data: results, nextCursor };
}
