// utils/upstashRedisRest.ts
const REDIS_TIMEOUT = 1000; // Reduced from 5000ms

export async function upstashSet(key: string, value: unknown, expireSeconds?: number): Promise<void> {
  if (typeof key !== "string" || key.length === 0) return;

  try {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);
    const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(stringValue)}${expireSeconds ? `?ex=${expireSeconds}` : ''}`;

    // Remove AbortController - let it run in background indefinitely
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
        "Connection": "keep-alive"
      }
    });
  } catch (error) {
    console.error("Redis SET failed silently (background operation):", error);
  }
}

export async function upstashGet(key: string): Promise<string | null> {
  if (typeof key !== "string") return null;

  try {
    // Let the OS handle TCP timeouts (~30s default)
    const response = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          "Connection": "keep-alive"
        }
      }
    );

    return response.ok ? (await response.json()).result : null;
  } catch (error) {
    console.error("Redis GET failed (non-critical):", error);
    return null; // Silent fallback to DB
  }
}