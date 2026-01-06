import { PrismaClient } from "@prisma/client";
import { upstashGet, upstashSet } from "./upstashRedisRest";
import { getCacheVersion } from "./cacheVersion";

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
  select?: Record<string, any>;
  include?: Record<string, any>;
};

export async function cursorPaginate<T extends keyof PrismaClient, R = any>(
  prisma: PrismaClient,
  options: PaginationOptions<T>,
  cursor?: string | number,
  extraWhere?: any // ✅ separate where for filters
): Promise<{ data: R[]; nextCursor: string | number | null }> {
  const {
    model,
    cursorField = "id",
    limit = 50,
    cacheExpiry = 3600,
    select,
    include,
  } = options;

  const version = await getCacheVersion(String(model));

  const cacheKey = `p:${String(model).slice(0, 3)}:v:${version}:c:${
    cursor || "0"
  }:l:${limit}`;

  // Memory cache
  const memoryHit = memoryCache.get(cacheKey);
  if (memoryHit && Date.now() - memoryHit.timestamp < MEMORY_CACHE_TTL) {
    return memoryHit;
  }

  // Redis
  const redisData = await upstashGet(cacheKey);
  if (redisData) {
    const parsed = JSON.parse(redisData);
    memoryCache.set(cacheKey, { ...parsed, timestamp: Date.now() });
    return parsed;
  }

  // DB query

  console.log("🔥 HITTING PRISMA DB QUERY");

  const data = await (prisma[model] as any).findMany({
    where: {
      ...(extraWhere || {}),
      ...(cursor ? { [cursorField]: { gt: cursor } } : {}),
    },
    take: limit + 1,
    orderBy: { [cursorField]: "asc" },

    ...(select ? { select } : {}),
    ...(include ? { include } : {}),
  });

  const hasMore = data.length > limit;
  const results = hasMore ? data.slice(0, -1) : data;
  const nextCursor = hasMore ? data[limit - 1][cursorField] : null;

  // Cache
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
        if (typeof firstKey === "string") memoryCache.delete(firstKey);
      }
    }),
  ]).catch((e) => console.error("Caching failed:", e));

  return { data: results, nextCursor };
}
