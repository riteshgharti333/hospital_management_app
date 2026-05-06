"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPaginate = filterPaginate;
const paginationConfig_1 = require("../lib/paginationConfig");
async function filterPaginate(prisma, options, rawCursor, extraWhere) {
    const { model, select, include, orderBy = [{ createdAt: "desc" }, { id: "desc" }], } = options;
    // ✅ Safe limit (centralized + protected)
    const safeLimit = Math.max(1, Math.min(options.limit ?? paginationConfig_1.PAGINATION_CONFIG.DEFAULT_LIMIT, paginationConfig_1.PAGINATION_CONFIG.MAX_LIMIT));
    // ✅ PARSE CURSOR WITH COUNT TRACKING
    let cursorDate = null;
    let cursorId = null;
    let currentCount = 0;
    if (rawCursor && typeof rawCursor === "string") {
        const parts = rawCursor.split("|");
        if (parts.length === 2) {
            const [date, id] = parts;
            const parsedDate = new Date(date);
            const parsedId = Number(id);
            if (!isNaN(parsedDate.getTime()) && !isNaN(parsedId)) {
                cursorDate = parsedDate;
                cursorId = parsedId;
            }
        }
        else if (parts.length === 3) {
            // Handle cursor with count (from pagination)
            const [date, id, count] = parts;
            const parsedDate = new Date(date);
            const parsedId = Number(id);
            const parsedCount = Number(count);
            if (!isNaN(parsedDate.getTime()) && !isNaN(parsedId)) {
                cursorDate = parsedDate;
                cursorId = parsedId;
                currentCount = parsedCount;
            }
        }
    }
    // ✅ WHERE condition
    const whereCondition = {
        ...(extraWhere ?? {}),
        ...(cursorDate !== null && cursorId !== null
            ? {
                OR: [
                    { createdAt: { lt: cursorDate } },
                    {
                        AND: [{ createdAt: cursorDate }, { id: { lt: cursorId } }],
                    },
                ],
            }
            : {}),
    };
    const data = await prisma[model].findMany({
        where: whereCondition,
        orderBy,
        take: safeLimit + 1,
        ...(select ? { select } : {}),
        ...(include ? { include } : {}),
    });
    const hasMoreData = data.length > safeLimit;
    const results = hasMoreData ? data.slice(0, safeLimit) : data;
    // ✅ Update the count of records sent to client
    const newCount = currentCount + results.length;
    // ✅ Enforce the 300 record limit
    let hasMore = hasMoreData;
    if (newCount >= paginationConfig_1.PAGINATION_CONFIG.MAX_BROWSABLE) {
        hasMore = false;
    }
    let nextCursor = null;
    // ✅ Generate next cursor with count (same format as pagination)
    if (hasMore && results.length > 0) {
        const last = results[results.length - 1];
        nextCursor = `${last.createdAt.toISOString()}|${last.id}|${newCount}`;
    }
    return {
        data: results,
        nextCursor,
        hasMore,
    };
}
