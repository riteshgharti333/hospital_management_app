"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchQueryBuilder = void 0;
class SearchQueryBuilder {
    constructor(config, normalizedTerm, options) {
        this.config = config;
        this.normalizedTerm = normalizedTerm;
        this.options = options;
        this.searchWords = normalizedTerm.split(/\s+/);
        this.isMultiWord = this.searchWords.length > 1;
        this.useSimilarity = normalizedTerm.length >= 3;
    }
    build() {
        if (this.isMultiWord) {
            return this.buildMultiWordQuery();
        }
        else {
            return this.buildSingleWordQuery();
        }
    }
    buildMultiWordQuery() {
        const searchFields = this.getAllSearchFields();
        const whereClause = this.buildMultiWordWhereClause(searchFields);
        const selectFields = this.getSelectFields();
        const query = `
      SELECT ${selectFields},
             1 AS priority,
             0 AS rank_score
      FROM "${this.config.tableName}"
      WHERE (${whereClause})
      ORDER BY "${this.config.tableName}"."${this.config.sortField || "createdAt"}" DESC, 
               "${this.config.tableName}".id DESC
      LIMIT ${this.options.safeLimit}
    `;
        return { query, params: [], isMultiWord: true };
    }
    buildSingleWordQuery() {
        const searchFields = this.getAllSearchFields();
        const whereClause = this.buildSingleWordWhereClause(searchFields);
        const { caseExpr, similarityExpr, rankParams } = this.buildRankingExpressions(searchFields);
        const cursorCondition = this.buildCursorCondition();
        const selectFields = this.getSelectFields();
        const joinClauses = this.buildJoinClauses();
        const query = `
      SELECT ${selectFields},
             ${caseExpr},
             ${similarityExpr}
      FROM "${this.config.tableName}"
      ${joinClauses}
      WHERE (${whereClause})
      ${cursorCondition}
      ORDER BY "${this.config.tableName}"."${this.config.sortField || "createdAt"}" DESC, 
               "${this.config.tableName}".id DESC
      LIMIT ${this.options.safeLimit + 1}
    `;
        const whereParams = this.buildWhereParams(searchFields);
        const allParams = [...whereParams, ...rankParams];
        return { query, params: allParams, isMultiWord: false };
    }
    getAllSearchFields() {
        const fields = [];
        // Main table fields
        this.config.exactFields?.forEach((f) => fields.push({ type: "exact", expression: `LOWER("${f}")` }));
        this.config.prefixFields?.forEach((f) => fields.push({ type: "prefix", expression: `LOWER("${f}")` }));
        if (this.useSimilarity) {
            this.config.similarFields?.forEach((f) => fields.push({ type: "similar", expression: `LOWER("${f}")` }));
        }
        // Relation fields
        if (this.config.relationFields) {
            Object.entries(this.config.relationFields).forEach(([relation, relationFieldList]) => {
                const modelName = relation.charAt(0).toUpperCase() + relation.slice(1);
                relationFieldList.forEach((f) => {
                    const expr = `LOWER("${modelName}"."${f}")`;
                    fields.push({ type: "exact", expression: expr });
                    fields.push({ type: "prefix", expression: expr });
                    if (this.useSimilarity) {
                        fields.push({ type: "similar", expression: expr });
                    }
                });
            });
        }
        return fields;
    }
    buildMultiWordWhereClause(searchFields) {
        const wordConditions = this.searchWords
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
        return wordConditions;
    }
    buildSingleWordWhereClause(searchFields) {
        let paramCounter = 1;
        const whereParts = [];
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
        if (exactConditions)
            whereParts.push(`(${exactConditions})`);
        if (prefixConditions)
            whereParts.push(`(${prefixConditions})`);
        if (similarConditions)
            whereParts.push(`(${similarConditions})`);
        return whereParts.join(" OR ");
    }
    buildWhereParams(searchFields) {
        const params = [];
        const exactCount = searchFields.filter((f) => f.type === "exact").length;
        const prefixCount = searchFields.filter((f) => f.type === "prefix").length;
        const similarCount = searchFields.filter((f) => f.type === "similar").length;
        for (let i = 0; i < exactCount; i++)
            params.push(this.normalizedTerm);
        for (let i = 0; i < prefixCount; i++)
            params.push(`${this.normalizedTerm}%`);
        for (let i = 0; i < similarCount; i++)
            params.push(this.normalizedTerm);
        return params;
    }
    buildRankingExpressions(searchFields) {
        let paramCounter = 1;
        const caseWhen = [];
        const rankParams = [];
        const exactConditions = searchFields
            .filter((f) => f.type === "exact")
            .map((f) => {
            rankParams.push(this.normalizedTerm);
            return `${f.expression} = $${paramCounter++}`;
        })
            .join(" OR ");
        const prefixConditions = searchFields
            .filter((f) => f.type === "prefix")
            .map((f) => {
            rankParams.push(`${this.normalizedTerm}%`);
            return `${f.expression} LIKE $${paramCounter++}`;
        })
            .join(" OR ");
        const similarConditions = searchFields
            .filter((f) => f.type === "similar")
            .map((f) => {
            rankParams.push(this.normalizedTerm);
            return `${f.expression} % $${paramCounter++}`;
        })
            .join(" OR ");
        if (exactConditions)
            caseWhen.push(`WHEN ${exactConditions} THEN 1`);
        if (prefixConditions)
            caseWhen.push(`WHEN ${prefixConditions} THEN 2`);
        if (similarConditions)
            caseWhen.push(`WHEN ${similarConditions} THEN 3`);
        caseWhen.push(`ELSE 4`);
        const caseExpr = `CASE ${caseWhen.join(" ")} END AS priority`;
        const similarityExpr = this.useSimilarity && this.config.similarFields.length > 0
            ? `GREATEST(${this.config.similarFields.map(() => {
                rankParams.push(this.normalizedTerm);
                return `similarity(LOWER("${this.config.similarFields[0]}"), $${paramCounter++})`;
            }).join(", ")}) AS rank_score`
            : "0 AS rank_score";
        return { caseExpr, similarityExpr, rankParams };
    }
    buildCursorCondition() {
        const { cursorDate, cursorId } = this.options;
        if (cursorDate !== null && cursorId !== null) {
            return `
        AND (
          "${this.config.sortField || "createdAt"}" < '${cursorDate.toISOString()}'
          OR (
            "${this.config.sortField || "createdAt"}" = '${cursorDate.toISOString()}'
            AND id < ${cursorId}
          )
        )
      `;
        }
        return "";
    }
    buildJoinClauses() {
        let joinClauses = "";
        if (this.config.relationFields) {
            Object.keys(this.config.relationFields).forEach((relation) => {
                const modelName = relation.charAt(0).toUpperCase() + relation.slice(1);
                joinClauses += `
          LEFT JOIN "${modelName}" ON "${this.config.tableName}"."${relation}Id" = "${modelName}"."id"
        `;
            });
        }
        return joinClauses;
    }
    getSelectFields() {
        if (this.config.include) {
            return `"${this.config.tableName}".id`;
        }
        if (this.config.selectFields?.length) {
            return this.config.selectFields
                .map((f) => `"${this.config.tableName}"."${f}"`)
                .join(", ");
        }
        return `"${this.config.tableName}".*`;
    }
}
exports.SearchQueryBuilder = SearchQueryBuilder;
