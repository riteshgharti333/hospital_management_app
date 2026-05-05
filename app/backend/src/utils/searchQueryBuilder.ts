interface SearchConfig {
  tableName: string;
  exactFields: string[];
  prefixFields: string[];
  similarFields: string[];
  sortField?: string;
  selectFields?: string[];
  relationFields?: Record<string, string[]>;
  include?: Record<string, any>;
}

interface QueryOptions {
  cursorDate: Date | null;
  cursorId: number | null;
  safeLimit: number;
}

export class SearchQueryBuilder {
  private config: SearchConfig;
  private normalizedTerm: string;
  private options: QueryOptions;
  private searchWords: string[];
  private isMultiWord: boolean;
  private useSimilarity: boolean;

  constructor(config: SearchConfig, normalizedTerm: string, options: QueryOptions) {
    this.config = config;
    this.normalizedTerm = normalizedTerm;
    this.options = options;
    this.searchWords = normalizedTerm.split(/\s+/);
    this.isMultiWord = this.searchWords.length > 1;
    this.useSimilarity = normalizedTerm.length >= 3;
  }

  build(): { query: string; params: any[]; isMultiWord: boolean } {
    if (this.isMultiWord) {
      return this.buildMultiWordQuery();
    } else {
      return this.buildSingleWordQuery();
    }
  }

  private buildMultiWordQuery(): { query: string; params: any[]; isMultiWord: boolean } {
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

  private buildSingleWordQuery(): { query: string; params: any[]; isMultiWord: boolean } {
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

  private getAllSearchFields() {
    const fields: {
      type: "exact" | "prefix" | "similar";
      expression: string;
    }[] = [];

    // Main table fields
    this.config.exactFields?.forEach((f: string) =>
      fields.push({ type: "exact", expression: `LOWER("${f}")` })
    );
    this.config.prefixFields?.forEach((f: string) =>
      fields.push({ type: "prefix", expression: `LOWER("${f}")` })
    );
    if (this.useSimilarity) {
      this.config.similarFields?.forEach((f: string) =>
        fields.push({ type: "similar", expression: `LOWER("${f}")` })
      );
    }

    // Relation fields
    if (this.config.relationFields) {
      Object.entries(this.config.relationFields).forEach(
        ([relation, relationFieldList]) => {
          const modelName = relation.charAt(0).toUpperCase() + relation.slice(1);
          relationFieldList.forEach((f: string) => {
            const expr = `LOWER("${modelName}"."${f}")`;
            fields.push({ type: "exact", expression: expr });
            fields.push({ type: "prefix", expression: expr });
            if (this.useSimilarity) {
              fields.push({ type: "similar", expression: expr });
            }
          });
        }
      );
    }

    return fields;
  }

  private buildMultiWordWhereClause(searchFields: any[]): string {
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

  private buildSingleWordWhereClause(searchFields: any[]): string {
    let paramCounter = 1;
    const whereParts: string[] = [];

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

    if (exactConditions) whereParts.push(`(${exactConditions})`);
    if (prefixConditions) whereParts.push(`(${prefixConditions})`);
    if (similarConditions) whereParts.push(`(${similarConditions})`);

    return whereParts.join(" OR ");
  }

  private buildWhereParams(searchFields: any[]): string[] {
    const params: string[] = [];
    const exactCount = searchFields.filter((f) => f.type === "exact").length;
    const prefixCount = searchFields.filter((f) => f.type === "prefix").length;
    const similarCount = searchFields.filter((f) => f.type === "similar").length;

    for (let i = 0; i < exactCount; i++) params.push(this.normalizedTerm);
    for (let i = 0; i < prefixCount; i++) params.push(`${this.normalizedTerm}%`);
    for (let i = 0; i < similarCount; i++) params.push(this.normalizedTerm);

    return params;
  }

  private buildRankingExpressions(searchFields: any[]) {
    let paramCounter = 1;
    const caseWhen: string[] = [];
    const rankParams: any[] = [];

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

    if (exactConditions) caseWhen.push(`WHEN ${exactConditions} THEN 1`);
    if (prefixConditions) caseWhen.push(`WHEN ${prefixConditions} THEN 2`);
    if (similarConditions) caseWhen.push(`WHEN ${similarConditions} THEN 3`);
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

  private buildCursorCondition(): string {
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

  private buildJoinClauses(): string {
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

  private getSelectFields(): string {
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