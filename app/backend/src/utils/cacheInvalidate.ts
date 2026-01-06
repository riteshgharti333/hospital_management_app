import { upstashDelete } from "./upstashRedisRest";

export const invalidateRedisByPrefix = async (prefix: string) => {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/keys/${encodeURIComponent(
    prefix + "*"
  )}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    },
  });

  if (!res.ok) return;
 
  const data = await res.json();
  const keys: string[] = data?.result || [];

  if (keys.length) {
    await Promise.all(keys.map((k) => upstashDelete(k)));
  }
};
