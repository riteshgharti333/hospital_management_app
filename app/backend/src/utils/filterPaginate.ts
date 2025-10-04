import { PrismaClient } from "@prisma/client";
import { upstashGet, upstashSet } from "./upstashRedisRest";

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

type FilterPaginationOptions<T extends keyof PrismaClient> = {
  model: T;
  cursorField?: string;
  limit?: number;
  cacheExpiry?: number;
  select?: Record<string, boolean>;
  filters?: Record<string, any>; // filter object like {patientSex, bloodGroup}
};

export async function filterPaginate<T extends keyof PrismaClient, R = any>(
  prisma: PrismaClient,
  options: FilterPaginationOptions<T>,
  cursor?: string | number
): Promise<{ data: R[]; nextCursor: string | number | null }> {
  const {
    model,
    cursorField = "id",
    limit = 50,
    cacheExpiry = 3600,
    select,
    filters = {},
  } = options;

  // 1️⃣ Create a cache key that includes filters
  const filterKeyPart = Object.entries(filters)
    .map(([k, v]) => {
      if (v && typeof v === "object") return `${k}:${JSON.stringify(v)}`;
      return `${k}:${v ?? ""}`;
    })
    .join("|");

  const cacheKey = `pf:${String(model).slice(0, 3)}:c:${
    cursor || 0
  }:l:${limit}:f:${filterKeyPart}`;

  // 2️⃣ Check memory cache
  const memoryHit = memoryCache.get(cacheKey);
  if (memoryHit && Date.now() - memoryHit.timestamp < MEMORY_CACHE_TTL) {
    return memoryHit;
  }

  // 3️⃣ Check Redis
  try {
    const redisData = await upstashGet(cacheKey);
    if (redisData) {
      const parsed = JSON.parse(redisData);
      memoryCache.set(cacheKey, { ...parsed, timestamp: Date.now() });
      return parsed;
    }
  } catch (e) {
    console.error("Redis filter cache error:", e);
  }

  // 4️⃣ Build DB query
  const where: any = {};

  for (const key in filters) {
    const value = filters[key];
    if (value !== undefined && value !== null) {
      where[key] = value;
    }
  }

  if (cursor) where[cursorField] = { gt: cursor };

  const data = await (prisma[model] as any).findMany({
    where,
    take: limit + 1,
    orderBy: { [cursorField]: "asc" },
    select,
  });

  const hasMore = data.length > limit;
  const results = hasMore ? data.slice(0, -1) : data;
  const nextCursor = hasMore ? data[limit - 1][cursorField] : null;

  // 5️⃣ Cache results
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
  ]).catch((e) => console.error("Filter caching failed:", e));

  return { data: results, nextCursor };
}
