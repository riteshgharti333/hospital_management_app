// utils/upstashRedisRest.ts
const REDIS_TIMEOUT = 1000; // 1s fetch timeout
const MAX_RETRIES = 2;
const COOLDOWN_MS = 10000; // disable Redis for 10s after repeated failures

let redisHealthy = true;
let lastRedisFailTime = 0;

/** Retry wrapper with small backoff */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 100 * (i + 1)));
    }
  }
  throw lastErr;
}

/** Health check + cooldown */
function isRedisAvailable(): boolean {
  if (!redisHealthy) {
    const now = Date.now();
    if (now - lastRedisFailTime > COOLDOWN_MS) {
      redisHealthy = true;
    } else {
      return false;
    }
  }
  return true;
}

async function handleFailure(error: any, op: string) {
  redisHealthy = false;
  lastRedisFailTime = Date.now();
  console.warn(
    `[Redis ${op}] temporarily disabled due to errors:`,
    error?.message || error
  );
}

/** Redis SET */
export async function upstashSet(
  key: string,
  value: unknown,
  expireSeconds?: number
): Promise<void> {
  if (!isRedisAvailable() || typeof key !== "string" || key.length === 0)
    return;

  try {
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);
    const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(
      key
    )}/${encodeURIComponent(stringValue)}${
      expireSeconds ? `?ex=${expireSeconds}` : ""
    }`;

    await withRetry(() =>
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json",
          Connection: "keep-alive",
        },
      })
    );
  } catch (error) {
    await handleFailure(error, "SET");
  }
}

/** Redis GET */
export async function upstashGet(key: string): Promise<string | null> {
  if (!isRedisAvailable() || typeof key !== "string") return null;

  try {
    const response = await withRetry(() =>
      fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
            Connection: "keep-alive",
          },
        }
      )
    );

    if (!response.ok)
      throw new Error(`Redis GET failed with status ${response.status}`);
    const data = await response.json();
    return data?.result ?? null;
  } catch (error) {
    await handleFailure(error, "GET");
    return null;
  }
}

/** Redis DELETE */
export async function upstashDelete(key: string): Promise<void> {
  if (!isRedisAvailable() || typeof key !== "string" || key.length === 0)
    return;

  try {
    const url = `${process.env.UPSTASH_REDIS_REST_URL}/del/${encodeURIComponent(
      key
    )}`;
    await withRetry(() =>
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json",
          Connection: "keep-alive",
        },
      })
    );
  } catch (error) {
    await handleFailure(error, "DELETE");
  }
}
