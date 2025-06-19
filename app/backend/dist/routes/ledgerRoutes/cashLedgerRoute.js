"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CashLedgerController_1 = require("../../controllers/ledger/CashLedgerController");
const router = express_1.default.Router();
router.route("/")
    .post(CashLedgerController_1.createCashLedgerRecord)
    .get(CashLedgerController_1.getAllCashLedgerRecords);
router.route("/balance")
    .get(CashLedgerController_1.getCashBalanceRecord);
router.route("/:id")
    .get(CashLedgerController_1.getCashLedgerRecordById)
    .patch(CashLedgerController_1.updateCashLedgerRecord)
    .delete(CashLedgerController_1.deleteCashLedgerRecord);
exports.default = router;
