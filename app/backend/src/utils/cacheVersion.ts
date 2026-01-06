import { upstashGet, upstashSet } from "./upstashRedisRest";

const VERSION_PREFIX = "v";

export const getCacheVersion = async (domain: string): Promise<number> => {
  const key = `${VERSION_PREFIX}:${domain}`;
  const value = await upstashGet(key);
  return value ? Number(value) : 1;
};

export const bumpCacheVersion = async (domain: string): Promise<void> => {
  const key = `${VERSION_PREFIX}:${domain}`;
  const current = await getCacheVersion(domain);
  await upstashSet(key, String(current + 1));
};
