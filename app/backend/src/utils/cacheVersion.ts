import { upstashGet, upstashSet, upstashIncr } from "./upstashRedisRest";

const VERSION_PREFIX = "v";

/**
 * Get cache version (safe fallback)
 */
export const getCacheVersion = async (domain: string): Promise<number> => {
  const key = `${VERSION_PREFIX}:${domain}`;

  try {
    const value = await upstashGet(key);
    return value ? Number(value) : 1;
  } catch (error) {
    // ✅ Redis failure should NOT break app
    console.warn(`Cache GET failed for ${domain}, using fallback version`);
    return 1;
  }
};

/**
 * Atomic version increment (non-blocking)
 */
export const bumpCacheVersion = async (domain: string): Promise<void> => {
  const key = `${VERSION_PREFIX}:${domain}`;

  console.log(`Bumping cache version for: ${domain}`, key); // Add this

  try {
    // ✅ Atomic increment (NO race condition)
    await upstashIncr(key);
  } catch (error) {
    // ✅ Do NOT block main flow
    console.warn(`Cache version bump failed for ${domain}`);
  }
};
