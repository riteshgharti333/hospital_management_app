"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpenseEntry = exports.updateExpenseEntry = exports.getTotalExpenses = exports.getExpenseSummaryByCategory = exports.getExpenseEntryById = exports.getAllExpenseEntries = exports.createExpenseEntry = void 0;
const prisma_1 = require("../../lib/prisma");
const createExpenseEntry = async (data) => {
    return prisma_1.prisma.expenseLedger.create({ data });
};
exports.createExpenseEntry = createExpenseEntry;
const getAllExpenseEntries = async (filters) => {
    const where = {};
    if (filters.expenseCategory) {
        where.expenseCategory = filters.expenseCategory;
    }
    if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate)
            where.date.gte = filters.startDate;
        if (filters.endDate)
            where.date.lte = filters.endDate;
    }
    return prisma_1.prisma.expenseLedger.findMany({
        where,
        orderBy: { date: 'desc' }
    });
};
exports.getAllExpenseEntries = getAllExpenseEntries;
const getExpenseEntryById = async (id) => {
    return prisma_1.prisma.expenseLedger.findUnique({ where: { id } });
};
exports.getExpenseEntryById = getExpenseEntryById;
const getExpenseSummaryByCategory = async () => {
    return prisma_1.prisma.expenseLedger.groupBy({
        by: ['expenseCategory'],
        _sum: {
            amount: true
        },
        orderBy: {
            _sum: {
                amount: 'desc'
            }
        }
    });
};
exports.getExpenseSummaryByCategory = getExpenseSummaryByCategory;
const getTotalExpenses = async () => {
    const result = await prisma_1.prisma.expenseLedger.aggregate({
        _sum: {
            amount: true
        }
    });
    return result._sum.amount || 0;
};
exports.getTotalExpenses = getTotalExpenses;
const updateExpenseEntry = async (id, data) => {
    return prisma_1.prisma.expenseLedger.update({
        where: { id },
        data,
    });
};
exports.updateExpenseEntry = updateExpenseEntry;
const deleteExpenseEntry = async (id) => {
    return prisma_1.prisma.expenseLedger.delete({ where: { id } });
};
exports.deleteExpenseEntry = deleteExpenseEntry;
