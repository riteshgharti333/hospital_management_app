"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, { success, message, data, statusCode, pagination }) => {
    const responseBody = {
        success,
        message,
        data,
    };
    if (pagination) {
        responseBody.pagination = pagination;
    }
    res.status(statusCode).json(responseBody);
};
exports.sendResponse = sendResponse;
