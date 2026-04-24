"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSearchService = void 0;
const createSearchService = (prisma, config) => {
    return async (searchTerm) => {
        const start = performance.now();
        // =========================
        // 1️⃣ Normalize input (improved)
        // =========================
        const normalizedTerm = searchTerm
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " "); // remove extra spaces
        // =========================
        // 2️⃣ Min length guard (strict)
        // =========================
        if (normalizedTerm.length < 2)
            return [];
        // =========================
        // Split multi-word queries
        // =========================
        const searchWords = normalizedTerm.split(/\s+/);
        const isMultiWord = searchWords.length > 1;
        // =========================
        // 3️⃣ Disable similarity for short input
        // =========================
        const useSimilarity = normalizedTerm.length >= 3;
        const escapeField = (f) => `"${f}"`;
        // =========================
        // MULTI-WORD SEARCH
        // =========================
        if (isMultiWord) {
            const wordConditions = searchWords.map(word => {
                const exactChecks = config.exactFields.length
                    ? config.exactFields.map(f => `LOWER(${escapeField(f)}) = '${word}'`).join(" OR ")
                    : "";
                const prefixChecks = config.prefixFields.length
                    ? config.prefixFields.map(f => `LOWER(${escapeField(f)}) LIKE '${word}%'`).join(" OR ")
                    : "";
                const similarChecks = (useSimilarity && config.similarFields.length)
                    ? config.similarFields.map(f => `LOWER(${escapeField(f)}) % '${word}'`).join(" OR ")
                    : "";
                const allChecks = [exactChecks, prefixChecks, similarChecks].filter(Boolean).join(" OR ");
                return `(${allChecks})`;
            }).join(" AND ");
            const selectFields = config.selectFields?.length
                ? config.selectFields.map(f => `"${f}"`).join(", ")
                : "*";
            const limit = Math.min(config.maxResults || 50, 100);
            const query = `
        SELECT ${selectFields}
        FROM "${config.tableName}"
        WHERE ${wordConditions}
        ORDER BY "${config.sortField || "createdAt"}" DESC
        LIMIT ${limit}
      `;
            const results = await prisma.$queryRawUnsafe(query);
            const duration = performance.now() - start;
            if (duration > 100) {
                console.log(`[SEARCH] ${config.tableName} "${normalizedTerm}" → ${duration.toFixed(2)}ms (multi-word)`);
            }
            return results;
        }
        // =========================
        // SINGLE WORD SEARCH (original logic)
        // =========================
        const values = [
            normalizedTerm, // $1 exact
            `${normalizedTerm}%`, // $2 prefix
            normalizedTerm, // $3 similarity
        ];
        // =========================
        // CONDITIONS
        // =========================
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
        const similarConditions = useSimilarity && config.similarFields.length
            ? config.similarFields
                .map((f) => `LOWER(${escapeField(f)}) % $3`)
                .join(" OR ")
            : "";
        const whereParts = [];
        if (exactConditions)
            whereParts.push(`(${exactConditions})`);
        if (prefixConditions)
            whereParts.push(`(${prefixConditions})`);
        if (similarConditions)
            whereParts.push(`(${similarConditions})`);
        if (whereParts.length === 0)
            return [];
        const whereClause = whereParts.join(" OR ");
        // =========================
        // 4️⃣ Ranking logic
        // =========================
        const caseWhen = [];
        if (exactConditions)
            caseWhen.push(`WHEN ${exactConditions} THEN 1`);
        if (prefixConditions)
            caseWhen.push(`WHEN ${prefixConditions} THEN 2`);
        if (similarConditions)
            caseWhen.push(`WHEN ${similarConditions} THEN 3`);
        caseWhen.push(`ELSE 4`);
        const caseExpr = `CASE ${caseWhen.join(" ")} END AS priority`;
        // =========================
        // 5️⃣ Similarity score (safe)
        // =========================
        const similarityExpr = useSimilarity && config.similarFields.length
            ? `GREATEST(${config.similarFields
                .map((f) => `similarity(LOWER(${escapeField(f)}), $3)`)
                .join(", ")}) AS rank_score`
            : `0 AS rank_score`;
        // =========================
        // 6️⃣ Select fields (safe)
        // =========================
        const selectFields = config.selectFields?.length
            ? config.selectFields.map((f) => `"${f}"`).join(", ")
            : "*";
        // =========================
        // 7️⃣ Limit guard (MAX safety)
        // =========================
        const limit = Math.min(config.maxResults || 50, 100);
        const query = `
      SELECT ${selectFields},
             ${caseExpr},
             ${similarityExpr}
      FROM "${config.tableName}"
      WHERE (${whereClause})
      ORDER BY priority ASC, rank_score DESC, "${config.sortField || "createdAt"}" DESC
      LIMIT ${limit}
    `;
        const results = await prisma.$queryRawUnsafe(query, ...values);
        // =========================
        // Performance logging
        // =========================
        const duration = performance.now() - start;
        if (duration > 100) {
            console.log(`[SEARCH] ${config.tableName} "${normalizedTerm}" → ${duration.toFixed(2)}ms`);
        }
        return results;
    };
};
exports.createSearchService = createSearchService;
