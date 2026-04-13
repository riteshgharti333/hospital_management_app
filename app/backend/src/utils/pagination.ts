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

const MEMORY_CACHE_TTL = 30000;
const MAX_MEMORY_ENTRIES = 1000;

type PaginationOptions<T extends keyof PrismaClient> = {
  model: T;
  cursorField?: string;
  limit?: number;
  cacheExpiry?: number;
  select?: Record<string, any>;
  include?: Record<string, any>;
  orderBy?: any;
};

export async function cursorPaginate<T extends keyof PrismaClient, R = any>(
  prisma: PrismaClient,
  options: PaginationOptions<T>,
  cursor?: string | number,
  extraWhere?: any
): Promise<{ data: R[]; nextCursor: string | number | null }> {
  const {
    model,
    limit = 50,
    cacheExpiry = 3600,
    select,
    include,
    orderBy,
  } = options;

  const version = await getCacheVersion(String(model));

  const cacheKey = `p:${String(model).slice(0, 3)}:v:${version}:c:${
    cursor || "0"
  }:l:${limit}`;

  // ✅ Memory cache
  const memoryHit = memoryCache.get(cacheKey);
  if (memoryHit && Date.now() - memoryHit.timestamp < MEMORY_CACHE_TTL) {
    return memoryHit;
  }

  // ✅ Redis cache
  const redisData = await upstashGet(cacheKey);
  if (redisData) {
    const parsed = JSON.parse(redisData);
    memoryCache.set(cacheKey, { ...parsed, timestamp: Date.now() });
    return parsed;
  }

  console.log("🔥 HITTING PRISMA DB QUERY");

  // ✅ Decode composite cursor
  let cursorDate: Date | null = null;
  let cursorId: number | null = null;

  if (cursor) {
    const [date, id] = String(cursor).split("|");
    if (date && id) {
      cursorDate = new Date(date);
      cursorId = Number(id);
    }
  }

  // ✅ DB query with composite cursor
  const data = await (prisma[model] as any).findMany({
    where: {
      ...(extraWhere || {}),
      ...(cursorDate && cursorId
        ? {
            OR: [
              { createdAt: { lt: cursorDate } },
              {
                AND: [
                  { createdAt: cursorDate },
                  { id: { lt: cursorId } },
                ],
              },
            ],
          }
        : {}),
    },

    orderBy: orderBy || [
      { createdAt: "desc" },
      { id: "desc" },
    ],

    take: limit + 1,

    ...(select ? { select } : {}),
    ...(include ? { include } : {}),
  });

  // ✅ Pagination logic
  const hasMore = data.length > limit;
  const results = hasMore ? data.slice(0, limit) : data;

  // ✅ Composite nextCursor
  let nextCursor: string | null = null;

  if (hasMore && results.length > 0) {
    const lastItem = results[results.length - 1];
    nextCursor = `${lastItem.createdAt.toISOString()}|${lastItem.id}`;
  }

  // ✅ Cache
  const cachePayload = JSON.stringify({ data: results, nextCursor });

  Promise.all([
    upstashSet(cacheKey, cachePayload, cacheExpiry),
    new Promise<void>((resolve) => {
      memoryCache.set(cacheKey, {
        data: results,
        nextCursor,
        timestamp: Date.now(),
      });

      if (memoryCache.size > MAX_MEMORY_ENTRIES) {
        const firstKey = memoryCache.keys().next().value;
        if (typeof firstKey === "string") memoryCache.delete(firstKey);
      }

      resolve();
    }),
  ]).catch((e) => console.error("Caching failed:", e));

  return { data: results, nextCursor };
}