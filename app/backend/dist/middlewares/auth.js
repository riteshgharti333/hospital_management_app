"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
const authenticate = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Please authenticate'));
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        if (payload.type !== 'access') {
            throw new Error('Invalid token type');
        }
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) {
            return next(new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'User not found'));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, 'Invalid token'));
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError(http_status_1.default.FORBIDDEN, 'Forbidden resource'));
        }
        next();
    };
};
exports.authorize = authorize;
