import { upstashGet, upstashSet } from "./upstashRedisRest";

type CacheOptions<T> = {
  key: string;
  ttlSeconds?: number;
  fetcher: () => Promise<T>;
};

const DEFAULT_TTL = 5 * 60; // 5 minutes

export async function withDashboardCache<T>({
  key,
  ttlSeconds = DEFAULT_TTL,
  fetcher,
}: CacheOptions<T>): Promise<T> {
  // 1️⃣ Try Redis
  const cached = await upstashGet(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2️⃣ Fetch from DB
  const data = await fetcher();

  // 3️⃣ Store in cache (fire & forget)
  upstashSet(key, data, ttlSeconds).catch(() => {});

  return data;
}
