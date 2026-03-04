"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BankLedgerController_1 = require("../../controllers/ledger/BankLedgerController");
// 🔥 extra ../ for deep folder
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BankLedgerController_1.createBankLedgerRecord)
    .get(BankLedgerController_1.getAllBankLedgerRecords);
// BALANCE (read-only)
router.get("/balance", BankLedgerController_1.getBankBalanceRecord);
// SEARCH & FILTER
router.get("/search", BankLedgerController_1.searchBankLedgerResults);
router.get("/filter", BankLedgerController_1.filterBankLedger);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(BankLedgerController_1.getBankLedgerRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BankLedgerController_1.updateBankLedgerRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BankLedgerController_1.deleteBankLedgerRecord);
exports.default = router;
