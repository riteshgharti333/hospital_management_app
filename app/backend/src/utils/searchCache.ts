import { PrismaClient } from "@prisma/client";
import { PAGINATION_CONFIG } from "../lib/paginationConfig";

interface SearchConfig {
  tableName: string;
  exactFields: string[];
  prefixFields: string[];
  similarFields: string[];
  sortField?: string;
  maxResults?: number;
  selectFields?: string[];
}

interface SearchResult {
  data: any[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export const createSearchService = (
  prisma: PrismaClient,
  config: SearchConfig,
) => {
  return async (
    searchTerm: string,
    cursor?: string,
    limit?: number,
  ): Promise<SearchResult> => {
    const start = performance.now();

    // =========================
    // 1️⃣ Normalize input
    // =========================
    const normalizedTerm = searchTerm.trim().toLowerCase().replace(/\s+/g, " ");

    // =========================
    // 2️⃣ Min length guard
    // =========================
    if (normalizedTerm.length < 2) {
      return {
        data: [],
        pagination: {
          nextCursor: null,
          hasMore: false,
        },
      };
    }

    // =========================
    // 3️⃣ Limit control
    // =========================
    let safeLimit = limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT;
    if (safeLimit > PAGINATION_CONFIG.MAX_LIMIT)
      safeLimit = PAGINATION_CONFIG.MAX_LIMIT;

    // =========================
    // 4️⃣ Parse cursor with count tracking
    // =========================
    let cursorDate: Date | null = null;
    let cursorId: number | null = null;
    let currentCount = 0;

    if (cursor && cursor.includes("|")) {
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

    // =========================
    // Split multi-word queries
    // =========================
    const searchWords = normalizedTerm.split(/\s+/);
    const isMultiWord = searchWords.length > 1;
    const useSimilarity = normalizedTerm.length >= 3;

    const escapeField = (f: string) => `"${f}"`;

    // =========================
    // BUILD WHERE CLAUSE
    // =========================
    let whereClause = "";

    if (isMultiWord) {
      const wordConditions = searchWords
        .map((word) => {
          const exactChecks = config.exactFields.length
            ? config.exactFields
                .map((f) => `LOWER(${escapeField(f)}) = '${word}'`)
                .join(" OR ")
            : "";

          const prefixChecks = config.prefixFields.length
            ? config.prefixFields
                .map((f) => `LOWER(${escapeField(f)}) LIKE '${word}%'`)
                .join(" OR ")
            : "";

          const similarChecks =
            useSimilarity && config.similarFields.length
              ? config.similarFields
                  .map((f) => `LOWER(${escapeField(f)}) % '${word}'`)
                  .join(" OR ")
              : "";

          const allChecks = [exactChecks, prefixChecks, similarChecks]
            .filter(Boolean)
            .join(" OR ");

          return `(${allChecks})`;
        })
        .join(" AND ");

      whereClause = wordConditions;
    } else {
      const exactConditions = config.exactFields.length
        ? config.exactFields
            .map((f) => `LOWER(${escapeField(f)}) = $1`)
            .join(" OR ")
        : "";

      const prefixConditions = config.prefixFields.length
        ? config.prefixFields
            .map((f) => `LOWER(${escapeField(f)}) LIKE $2`)
            .join(" OR ")
        : "";

      const similarConditions =
        useSimilarity && config.similarFields.length
          ? config.similarFields
              .map((f) => `LOWER(${escapeField(f)}) % $3`)
              .join(" OR ")
          : "";

      const whereParts: string[] = [];
      if (exactConditions) whereParts.push(`(${exactConditions})`);
      if (prefixConditions) whereParts.push(`(${prefixConditions})`);
      if (similarConditions) whereParts.push(`(${similarConditions})`);

      whereClause = whereParts.join(" OR ");
    }

    if (!whereClause) {
      return {
        data: [],
        pagination: {
          nextCursor: null,
          hasMore: false,
        },
      };
    }

    // =========================
    // CURSOR CONDITION
    // ========================= 

    let cursorCondition = "";
    if (cursorDate !== null && cursorId !== null) {
      cursorCondition = `
        AND (
          "${config.sortField || "createdAt"}" < '${cursorDate.toISOString()}'
          OR (
            "${config.sortField || "createdAt"}" = '${cursorDate.toISOString()}'
            AND id < ${cursorId}
          )
        )
      `;
    }
    // =========================
    // RANKING LOGIC
    // =========================
    let caseWhen: string[] = [];
    if (!isMultiWord) {
      const exactConditions = config.exactFields.length
        ? config.exactFields
            .map((f) => `LOWER(${escapeField(f)}) = $1`)
            .join(" OR ")
        : "";
      const prefixConditions = config.prefixFields.length
        ? config.prefixFields
            .map((f) => `LOWER(${escapeField(f)}) LIKE $2`)
            .join(" OR ")
        : "";
      const similarConditions =
        useSimilarity && config.similarFields.length
          ? config.similarFields
              .map((f) => `LOWER(${escapeField(f)}) % $3`)
              .join(" OR ")
          : "";

      if (exactConditions) caseWhen.push(`WHEN ${exactConditions} THEN 1`);
      if (prefixConditions) caseWhen.push(`WHEN ${prefixConditions} THEN 2`);
      if (similarConditions) caseWhen.push(`WHEN ${similarConditions} THEN 3`);
      caseWhen.push(`ELSE 4`);
    }

    const caseExpr = caseWhen.length
      ? `CASE ${caseWhen.join(" ")} END AS priority`
      : "1 AS priority";
    const similarityExpr =
      !isMultiWord && useSimilarity && config.similarFields.length
        ? `GREATEST(${config.similarFields.map((f) => `similarity(LOWER(${escapeField(f)}), $3)`).join(", ")}) AS rank_score`
        : `0 AS rank_score`;

    // =========================
    // SELECT FIELDS
    // =========================
    const selectFields = config.selectFields?.length
      ? config.selectFields.map((f) => `"${f}"`).join(", ")
      : "*";

    // =========================
    // FINAL QUERY WITH PAGINATION
    // =========================
    const query = `
      SELECT ${selectFields},
             ${caseExpr},
             ${similarityExpr}
      FROM "${config.tableName}"
      WHERE (${whereClause})
      ${cursorCondition}
      ORDER BY "${config.sortField || "createdAt"}" DESC, id DESC
      LIMIT ${safeLimit + 1}
    `;

    let results: any[];

    if (isMultiWord) {
      results = await prisma.$queryRawUnsafe<any[]>(query);
    } else {
      results = await prisma.$queryRawUnsafe<any[]>(
        query,
        normalizedTerm,
        `${normalizedTerm}%`,
        normalizedTerm,
      );
    }

    // =========================
    // PAGINATION LOGIC
    // =========================
    const hasMoreData = results.length > safeLimit;
    const paginatedResults = hasMoreData
      ? results.slice(0, safeLimit)
      : results;

    const newCount = currentCount + paginatedResults.length;

    let hasMore = hasMoreData;
    if (newCount >= PAGINATION_CONFIG.MAX_BROWSABLE) {
      hasMore = false;
    }

    let nextCursor: string | null = null;

    if (hasMore && paginatedResults.length > 0) {
      const lastItem = paginatedResults[paginatedResults.length - 1];
      const sortField = config.sortField || "createdAt";
      const cursorValue =
        lastItem[sortField] instanceof Date
          ? lastItem[sortField].toISOString()
          : lastItem[sortField];
      nextCursor = `${cursorValue}|${lastItem.id}|${newCount}`;
    }

    // =========================
    // Performance logging
    // =========================
    const duration = performance.now() - start;
    if (duration > 100) {
      console.log(
        `[SEARCH] ${config.tableName} "${normalizedTerm}" → ${duration.toFixed(2)}ms`,
      );
    }

    return {
      data: paginatedResults,
      pagination: {
        nextCursor,
        hasMore,
      },
    };
  };
};
