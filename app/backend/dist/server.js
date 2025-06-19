"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const checkPrismaConnection_1 = require("./utils/checkPrismaConnection");
(0, checkPrismaConnection_1.checkDB)();
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
