// src/modules/ai/utils/normalizeQuery.ts

export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/\s+/g, ' ')    // Remove extra spaces
    .replace(/[?.,!]/g, '')  // Remove punctuation
    .trim();
}