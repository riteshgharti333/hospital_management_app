"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearchQuery = void 0;
const statusCodes_1 = require("../constants/statusCodes");
const errorHandler_1 = require("../middlewares/errorHandler");
const validateSearchQuery = (query, next, minLength = 2) => {
    if (typeof query !== "string" || query.trim().length < minLength) {
        next(new errorHandler_1.ErrorHandler(`Search query must be at least ${minLength} characters long`, statusCodes_1.StatusCodes.BAD_REQUEST));
        return undefined;
    }
    return query.trim();
};
exports.validateSearchQuery = validateSearchQuery;
