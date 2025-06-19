"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWithZod = validateWithZod;
const errorHandler_1 = require("../middlewares/errorHandler");
const statusCodes_1 = require("../constants/statusCodes");
function validateWithZod(schema, data) {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new errorHandler_1.ErrorHandler(result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "), statusCodes_1.StatusCodes.BAD_REQUEST);
    }
    return result.data;
}
