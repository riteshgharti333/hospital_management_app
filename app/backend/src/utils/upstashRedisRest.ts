// utils/upstashRedisRest.ts
export async function upstashSet(key: string, value: unknown, expireSeconds?: number): Promise<void> {
  if (typeof key !== "string" || key.length === 0) {
    console.error("Invalid Redis key");
    return;
  }

  const stringValue = typeof value === "string" ? value : JSON.stringify(value);
  let url = `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(stringValue)}`;
  
  if (expireSeconds) {
    url += `?ex=${expireSeconds}`;
  }

  try {
    // Add AbortController for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`Upstash SET failed: ${await response.text()}`);
    }
  } catch (error) {
    console.error("Redis SET error:", error);
  }
}

export async function upstashGet(key: string): Promise<string | null> {
  if (typeof key !== "string" || key.length === 0) {
    console.error("Invalid Redis key");
    return null;
  }

  try {
    // Add AbortController for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    
    const response = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`Upstash GET failed: ${await response.text()}`);
      return null;
    }

    const data = await response.json();
    return data.result ?? null;
  } catch (error) {
    console.error("Redis GET error:", error);
    return null;
  }
}