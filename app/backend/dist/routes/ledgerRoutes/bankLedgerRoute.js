"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BankLedgerController_1 = require("../../controllers/ledger/BankLedgerController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BankLedgerController_1.createBankLedgerRecord)
    .get(BankLedgerController_1.getAllBankLedgerRecords);
router.route("/balance").get(BankLedgerController_1.getBankBalanceRecord);
router.get("/search", BankLedgerController_1.searchBankLedgerResults);
router.get("/filter", BankLedgerController_1.filterBankLedger);
router
    .route("/:id")
    .get(BankLedgerController_1.getBankLedgerRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BankLedgerController_1.updateBankLedgerRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BankLedgerController_1.deleteBankLedgerRecord);
exports.default = router;
