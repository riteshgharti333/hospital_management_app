import { PrismaClient } from "@prisma/client";
import { upstashGet, upstashSet, upstashDelete } from "./upstashRedisRest"; // include delete here

// 🧠 Memory cache setup
const memoryCache = new Map<
  string,
  { data: any[]; nextCursor: string | number | null; timestamp: number }
>();
const MEMORY_CACHE_TTL = 30_000; // 30s
const MAX_MEMORY_ENTRIES = 1_000;

// 🔧 Cache helper functions (inline for reuse)
async function getFromCache(cacheKey: string) {
  // 1️⃣ Try memory cache
  const memoryHit = memoryCache.get(cacheKey);
  if (memoryHit && Date.now() - memoryHit.timestamp < MEMORY_CACHE_TTL) {
    return memoryHit;
  }

  // 2️⃣ Try Redis
  try {
    const redisData = await upstashGet(cacheKey);
    if (redisData) {
      const parsed = JSON.parse(redisData);
      memoryCache.set(cacheKey, { ...parsed, timestamp: Date.now() });
      return parsed;
    }
  } catch (err) {
    console.error("Redis read error:", err);
  }

  return null;
}

async function saveToCache(
  cacheKey: string,
  data: any[],
  nextCursor: string | number | null,
  expiry: number
) {
  const cachePayload = JSON.stringify({ data, nextCursor });

  // Store to Redis + Memory in parallel
  Promise.all([
    upstashSet(cacheKey, cachePayload, expiry),
    new Promise<void>((resolve) => {
      memoryCache.set(cacheKey, { data, nextCursor, timestamp: Date.now() });

      // cleanup oldest key if over limit
      if (memoryCache.size > MAX_MEMORY_ENTRIES) {
        const firstKey = memoryCache.keys().next().value;
        if (firstKey) memoryCache.delete(firstKey);
      }
      resolve();
    }),
  ]).catch((e) => console.error("Cache write failed:", e));
}

type FilterPaginationOptions<T extends keyof PrismaClient> = {
  model: T;
  cursorField?: string;
  limit?: number;
  cacheExpiry?: number;
  select?: Record<string, boolean>;
  filters?: Record<string, any>;
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

  // 🔑 Build unique cache key
  const filterKeyPart = Object.entries(filters)
    .map(([k, v]) => `${k}:${typeof v === "object" ? JSON.stringify(v) : v ?? ""}`)
    .join("|");

  const cacheKey = `pf:${String(model).slice(0, 3)}:c:${cursor || 0}:l:${limit}:f:${filterKeyPart}`;

  // 🧠 1. Check cache
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  // ⚙️ 2. Build query
  const where: any = {};
  for (const key in filters) {
    const value = filters[key];
    if (value !== undefined && value !== null) where[key] = value;
  }
  if (cursor) where[cursorField] = { gt: cursor };

  // 🧩 3. Fetch from DB
  const data = await (prisma[model] as any).findMany({
    where,
    take: limit + 1,
    orderBy: { [cursorField]: "asc" },
    select,
  });

  const hasMore = data.length > limit;
  const results = hasMore ? data.slice(0, -1) : data;
  const nextCursor = hasMore ? data[limit - 1][cursorField] : null;

  // 💾 4. Save cache
  await saveToCache(cacheKey, results, nextCursor, cacheExpiry);

  return { data: results, nextCursor };
}
