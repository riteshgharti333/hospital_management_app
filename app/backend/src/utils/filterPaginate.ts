import { PrismaClient } from "@prisma/client";

 const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
};



export async function filterPaginate<T extends keyof PrismaClient, R = any>(
  prisma: PrismaClient,
  options: {
    model: T;
    limit?: number;
    select?: Record<string, any>;
    include?: Record<string, any>;
    orderBy?: any;
  },
  rawCursor?: string,
  extraWhere?: any
): Promise<{
  data: R[];
  nextCursor: string | null;
}> {
  const {
    model,
    select,
    include,
    orderBy = [{ createdAt: "desc" }, { id: "desc" }],
  } = options;

  // ✅ CENTRALIZED LIMIT LOGIC
  const safeLimit = Math.min(
    options.limit || PAGINATION_CONFIG.DEFAULT_LIMIT,
    PAGINATION_CONFIG.MAX_LIMIT
  );

  let cursorDate: Date | null = null;
  let cursorId: number | null = null;

  if (rawCursor) {
    const [date, id] = rawCursor.split("|");

    if (date && id) {
      const parsedDate = new Date(date);
      const parsedId = Number(id);

      if (!isNaN(parsedDate.getTime()) && !isNaN(parsedId)) {
        cursorDate = parsedDate;
        cursorId = parsedId;
      }
    }
  }

  const whereCondition = {
    ...(extraWhere || {}),
    ...(cursorDate !== null && cursorId !== null
      ? {
          OR: [
            { createdAt: { lt: cursorDate } },
            {
              AND: [
                { createdAt: cursorDate },
                { id: { lt: cursorId } },
              ],
            },
          ],
        }
      : {}),
  };

  const data = await (prisma[model] as any).findMany({
    where: whereCondition,
    orderBy,
    take: safeLimit + 1, // ✅ use safeLimit
    ...(select ? { select } : {}),
    ...(include ? { include } : {}),
  });

  const hasMore = data.length > safeLimit;
  const results = hasMore ? data.slice(0, safeLimit) : data;

  let nextCursor: string | null = null;

  if (hasMore && results.length > 0) {
    const last = results[results.length - 1];
    nextCursor = `${last.createdAt.toISOString()}|${last.id}`;
  }

  return {
    data: results,
    nextCursor,
  };
}