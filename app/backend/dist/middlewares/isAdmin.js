"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
// import "express";
const errorHandler_1 = require("./errorHandler");
const statusCodes_1 = require("../constants/statusCodes");
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return next(new errorHandler_1.ErrorHandler("Access denied: Admins only", statusCodes_1.StatusCodes.FORBIDDEN));
    }
    next();
};
exports.isAdmin = isAdmin;
