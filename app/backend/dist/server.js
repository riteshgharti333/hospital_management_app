"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warmAdmissionCache = warmAdmissionCache;
const app_1 = __importDefault(require("./app"));
const admissionService_1 = require("./services/admissionService");
const checkPrismaConnection_1 = require("./utils/checkPrismaConnection");
const PORT = process.env.PORT || 5000;
async function warmAdmissionCache() {
    console.time("🟡 Warmup admissions");
    // Example: warm first 2 pages with 50 items each
    await Promise.all([
        (0, admissionService_1.getAllAdmissionsService)(undefined, 50), // page 1
        (0, admissionService_1.getAllAdmissionsService)("50", 50), // page 2 (cursor example)
    ]);
    console.timeEnd("🟡 Warmup admissions");
}
(async () => {
    try {
        await (0, checkPrismaConnection_1.checkDB)();
        // 🔥 Cache warm-up before server goes live
        await warmAdmissionCache();
        app_1.default.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
})();
