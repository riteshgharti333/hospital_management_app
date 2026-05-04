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
  relationFields?: Record<string, string[]>;
  include?: Record<string, any>;
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

    // Helper to get the correct Prisma model name
    const getModelName = (relation: string): string => {
      const modelName = relation.charAt(0).toUpperCase() + relation.slice(1);
      return modelName;
    };

    // Helper to escape relation fields
    const escapeRelationField = (relation: string, field: string) => {
      const modelName = getModelName(relation);
      return `"${modelName}"."${field}"`;
    };

    // =========================
    // BUILD WHERE CLAUSE
    // =========================
    let whereClause = "";

    // Collect all search fields including relation fields
    const getAllSearchFields = () => {
      const fields: {
        type: "exact" | "prefix" | "similar";
        expression: string;
        paramIndex?: number;
      }[] = [];

      // Main table fields
      config.exactFields?.forEach((f: string) =>
        fields.push({ type: "exact", expression: `LOWER(${escapeField(f)})` }),
      );
      config.prefixFields?.forEach((f: string) =>
        fields.push({ type: "prefix", expression: `LOWER(${escapeField(f)})` }),
      );
      if (useSimilarity) {
        config.similarFields?.forEach((f: string) =>
          fields.push({
            type: "similar",
            expression: `LOWER(${escapeField(f)})`,
          }),
        );
      }

      // Relation fields
      if (config.relationFields) {
        Object.entries(config.relationFields).forEach(
          ([relation, relationFieldList]) => {
            relationFieldList.forEach((f: string) => {
              fields.push({
                type: "exact",
                expression: `LOWER(${escapeRelationField(relation, f)})`,
              });
              fields.push({
                type: "prefix",
                expression: `LOWER(${escapeRelationField(relation, f)})`,
              });
              if (useSimilarity) {
                fields.push({
                  type: "similar",
                  expression: `LOWER(${escapeRelationField(relation, f)})`,
                });
              }
            });
          },
        );
      }

      return fields;
    };

    // Get all search fields to build the query
    const searchFields = getAllSearchFields();

    if (isMultiWord) {
      const wordConditions = searchWords
        .map((word) => {
          const exactChecks = searchFields
            .filter((f) => f.type === "exact")
            .map((f) => `${f.expression} = '${word}'`)
            .join(" OR ");

          const prefixChecks = searchFields
            .filter((f) => f.type === "prefix")
            .map((f) => `${f.expression} LIKE '${word}%'`)
            .join(" OR ");

          const similarChecks = searchFields
            .filter((f) => f.type === "similar")
            .map((f) => `${f.expression} % '${word}'`)
            .join(" OR ");

          const allChecks = [exactChecks, prefixChecks, similarChecks]
            .filter(Boolean)
            .join(" OR ");

          return `(${allChecks})`;
        })
        .join(" AND ");

      whereClause = wordConditions;
    } else {
      let paramCounter = 1;

      const exactConditions = searchFields
        .filter((f) => f.type === "exact")
        .map((f) => `${f.expression} = $${paramCounter++}`)
        .join(" OR ");

      const prefixConditions = searchFields
        .filter((f) => f.type === "prefix")
        .map((f) => `${f.expression} LIKE $${paramCounter++}`)
        .join(" OR ");

      const similarConditions = searchFields
        .filter((f) => f.type === "similar")
        .map((f) => `${f.expression} % $${paramCounter++}`)
        .join(" OR ");

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
      let paramCounter = 1;

      const exactConditions = searchFields
        .filter((f) => f.type === "exact")
        .map((f) => `${f.expression} = $${paramCounter++}`)
        .join(" OR ");

      const prefixConditions = searchFields
        .filter((f) => f.type === "prefix")
        .map((f) => `${f.expression} LIKE $${paramCounter++}`)
        .join(" OR ");

      const similarConditions = searchFields
        .filter((f) => f.type === "similar")
        .map((f) => `${f.expression} % $${paramCounter++}`)
        .join(" OR ");

      if (exactConditions) caseWhen.push(`WHEN ${exactConditions} THEN 1`);
      if (prefixConditions) caseWhen.push(`WHEN ${prefixConditions} THEN 2`);
      if (similarConditions) caseWhen.push(`WHEN ${similarConditions} THEN 3`);
      caseWhen.push(`ELSE 4`);
    }

    const caseExpr = caseWhen.length
      ? `CASE ${caseWhen.join(" ")} END AS priority`
      : "1 AS priority";

    const similarityExpr =
      !isMultiWord &&
      useSimilarity &&
      (config.similarFields.length > 0 ||
        (config.relationFields &&
          Object.values(config.relationFields).some(
            (fields) => fields.length > 0,
          )))
        ? `GREATEST(${(() => {
            const similarExprs: string[] = [];
            let paramCounter = 1;

            config.similarFields?.forEach((f: string) => {
              similarExprs.push(
                `similarity(LOWER(${escapeField(f)}), $${paramCounter++})`,
              );
            });

            if (config.relationFields) {
              Object.entries(config.relationFields).forEach(
                ([relation, fields]) => {
                  fields.forEach((f: string) => {
                    similarExprs.push(
                      `similarity(LOWER(${escapeRelationField(relation, f)}), $${paramCounter++})`,
                    );
                  });
                },
              );
            }

            return similarExprs.length > 0 ? similarExprs.join(", ") : "0";
          })()}) AS rank_score`
        : `0 AS rank_score`;

    // =========================
    // BUILD JOINS FOR RELATION FIELDS
    // =========================
    let joinClauses = "";
    if (config.relationFields) {
      Object.keys(config.relationFields).forEach((relation) => {
        const modelName = getModelName(relation);
        joinClauses += `
          LEFT JOIN "${modelName}" ON "${config.tableName}"."${relation}Id" = "${modelName}"."id"
        `;
      });
    }

    // =========================
    // SELECT FIELDS
    // =========================
    // If include is specified, we only need IDs from SQL (relations fetched later)
    // Otherwise, select all requested fields
    const selectFields = config.include
      ? `"${config.tableName}".id`
      : config.selectFields?.length
        ? config.selectFields
            .map((f) => `"${config.tableName}"."${f}"`)
            .join(", ")
        : `"${config.tableName}".*`;

    // =========================
    // FINAL QUERY WITH PAGINATION
    // =========================
    const query = `
      SELECT ${selectFields},
             ${caseExpr},
             ${similarityExpr}
      FROM "${config.tableName}"
      ${joinClauses}
      WHERE (${whereClause})
      ${cursorCondition}
      ORDER BY "${config.tableName}"."${config.sortField || "createdAt"}" DESC, "${config.tableName}".id DESC
      LIMIT ${safeLimit + 1}
    `;

    let results: any[];

    if (isMultiWord) {
      results = await prisma.$queryRawUnsafe<any[]>(query);
    } else {
      // Build parameters array for single word search
      const params: string[] = [];

      // Count parameters needed
      const exactCount = searchFields.filter((f) => f.type === "exact").length;
      const prefixCount = searchFields.filter(
        (f) => f.type === "prefix",
      ).length;
      const similarCount = searchFields.filter(
        (f) => f.type === "similar",
      ).length;

      // Add parameters in order: exact, prefix, similar
      for (let i = 0; i < exactCount; i++) params.push(normalizedTerm);
      for (let i = 0; i < prefixCount; i++) params.push(`${normalizedTerm}%`);
      for (let i = 0; i < similarCount; i++) params.push(normalizedTerm);

      results = await prisma.$queryRawUnsafe<any[]>(query, ...params);
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
    // FETCH FULL DATA WITH RELATIONS (only if include is specified)
    // =========================
    let finalData = paginatedResults;

    if (config.include && paginatedResults.length > 0) {
      const ids = paginatedResults.map((item: any) => item.id);

      // Get the Prisma model name (lowercase first letter)
      const modelName =
        config.tableName.charAt(0).toLowerCase() + config.tableName.slice(1);

      // Fetch full data with relations
      const fullResults = await (prisma as any)[modelName].findMany({
        where: {
          id: {
            in: ids,
          },
        },
        include: config.include,
      });

      // Create a map for quick lookup
      const dataMap = new Map(fullResults.map((item: any) => [item.id, item]));

      // Merge search metadata with full data while maintaining order
      finalData = paginatedResults.map((searchItem: any) => {
        const fullItem = dataMap.get(searchItem.id);
        if (fullItem) {
          return {
            ...fullItem,
            priority: searchItem.priority,
            rank_score: searchItem.rank_score,
          };
        }
        return searchItem;
      });
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
      data: finalData,
      pagination: {
        nextCursor,
        hasMore,
      },
    };
  };
};
