"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CashLedgerController_1 = require("../../controllers/ledger/CashLedgerController");
// 🔥 extra ../ for deep folder
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), CashLedgerController_1.createCashLedgerRecord)
    .get(CashLedgerController_1.getAllCashLedgerRecords);
// BALANCE (read-only)
router.get("/balance", CashLedgerController_1.getCashBalanceRecord);
// SEARCH & FILTER
router.get("/search", CashLedgerController_1.searchCashLedgerResults);
router.get("/filter", CashLedgerController_1.filterCashLedger);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(CashLedgerController_1.getCashLedgerRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), CashLedgerController_1.updateCashLedgerRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), CashLedgerController_1.deleteCashLedgerRecord);
exports.default = router;
