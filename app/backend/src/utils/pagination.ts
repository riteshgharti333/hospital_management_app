import { PrismaClient } from "@prisma/client";
import { upstashGet, upstashSet } from "./upstashRedisRest";
import { getCacheVersion } from "./cacheVersion";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";

const memoryCache = new Map<
  string,
  {
    data: any[];
    pagination: { nextCursor: string | null; hasMore: boolean };
    timestamp: number;
  }
>();

const MEMORY_CACHE_TTL = 30000;
const MAX_MEMORY_ENTRIES = 1000;

type PaginationOptions<T extends keyof PrismaClient> = {
  model: T;
  limit?: number;
  cacheExpiry?: number;
  select?: Record<string, any>;
  include?: Record<string, any>;
  orderBy?: any;
  where?: Record<string, any>; 
};

export async function cursorPaginate<T extends keyof PrismaClient, R = any>(
  prisma: PrismaClient,
  options: PaginationOptions<T>,
  rawCursor?: unknown,
  extraWhere?: any, 
): Promise<{
  data: R[];
  pagination: { nextCursor: string | null; hasMore: boolean };
}> {
  const {
    model,
    cacheExpiry = 3600,
    select,
    include,
    orderBy = [{ createdAt: "desc" }, { id: "desc" }],
    where: optionsWhere,  //  DESTRUCTURE THE WHERE FROM OPTIONS
  } = options;

  //  FIX: Normalize model name to lowercase for consistent cache keys
  const modelName = String(model).toLowerCase();

  //  LIMIT CONTROL
  let limit = options.limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT;
  if (limit > PAGINATION_CONFIG.MAX_LIMIT) limit = PAGINATION_CONFIG.MAX_LIMIT;

  //  Use normalized modelName for cache version
  const version = await getCacheVersion(modelName);

  //  PARSE CURSOR WITH COUNT TRACKING
  let cursorDate: Date | null = null;
  let cursorId: number | null = null;
  let currentCount = 0;

  const cursor =
    typeof rawCursor === "string" && rawCursor.includes("|")
      ? rawCursor
      : undefined;

  if (cursor) {
    const parts = cursor.split("|");
    const date = parts[0];
    const id = parts[1];
    const countFromCursor = Number(parts[2] || 0);

    const parsedDate = new Date(date);
    const parsedId = Number(id);

    if (!isNaN(parsedDate.getTime()) && !isNaN(parsedId)) {
      cursorDate = parsedDate;
      cursorId = parsedId;
      currentCount = countFromCursor;
    }
  }

  const safeCursor = cursor ? encodeURIComponent(cursor) : "0";

  //  Use normalized modelName in cache key
  const cacheKey = `p:${modelName}:v:${version}:c:${safeCursor}:l:${limit}:o:${encodeURIComponent(
    JSON.stringify(orderBy),
  )}`;

  //  MEMORY CACHE
  const memoryHit = memoryCache.get(cacheKey);
  if (memoryHit && Date.now() - memoryHit.timestamp < MEMORY_CACHE_TTL) {
    return memoryHit;
  }

  //  REDIS CACHE
  try {
    const redisData = await upstashGet(cacheKey);
    if (redisData) {
      const parsed = JSON.parse(redisData);
      memoryCache.set(cacheKey, { ...parsed, timestamp: Date.now() });
      return parsed;
    }
  } catch (e) {
    console.warn("Redis GET failed (safe fallback)");  
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("🔥 DB QUERY:", modelName);
  }

  //  WHERE CONDITION - MERGE optionsWhere AND extraWhere
  const whereCondition = {
    ...(optionsWhere || {}),      //  Add where from options
    ...(extraWhere || {}),        // Add extraWhere for backward compatibility
    ...(cursorDate !== null && cursorId !== null
      ? {
          OR: [
            { createdAt: { lt: cursorDate } },
            {
              AND: [{ createdAt: cursorDate }, { id: { lt: cursorId } }],
            },
          ],
        }
      : {}),
  };

  //  Keep original 'model' for Prisma query (not modelName)
  const data = await (prisma[model] as any).findMany({
    where: whereCondition,
    orderBy,
    take: limit + 1,
    ...(select ? { select } : {}),
    ...(include ? { include } : {}),
  });

  //  Check if there are more records after this fetch
  const hasMoreData = data.length > limit;

  //  Get the actual results (limit them to the requested page size)
  const results = hasMoreData ? data.slice(0, limit) : data;

  //  Update the count of records sent to client
  const newCount = currentCount + results.length;

  //  Enforce the 300 record limit
  let hasMore = hasMoreData;
  if (newCount >= PAGINATION_CONFIG.MAX_BROWSABLE) {
    hasMore = false;
  }

  let nextCursor: string | null = null;

  //  Only generate next cursor if we have more data AND we haven't reached the limit
  if (hasMore && results.length > 0) {
    const lastItem = results[results.length - 1];
    //  Include the count in the cursor
    nextCursor = `${lastItem.createdAt.toISOString()}|${lastItem.id}|${newCount}`;
  }

  const response = {
    data: results,
    pagination: {
      nextCursor,
      hasMore,
    },
  };

  const cachePayload = JSON.stringify(response);

  //  SAFE CACHE WRITE
  Promise.all([
    upstashSet(cacheKey, cachePayload, cacheExpiry).catch(() => {}),
    new Promise<void>((resolve) => {
      memoryCache.set(cacheKey, {
        ...response,
        timestamp: Date.now(),
      });

      if (memoryCache.size > MAX_MEMORY_ENTRIES) {
        const firstKey = memoryCache.keys().next().value;
        if (typeof firstKey === "string") memoryCache.delete(firstKey);
      }

      resolve();
    }),
  ]).catch(() => {});

  return response;
}