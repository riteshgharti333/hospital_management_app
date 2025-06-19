"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BankLedgerController_1 = require("../../controllers/ledger/BankLedgerController");
const router = express_1.default.Router();
router.route("/")
    .post(BankLedgerController_1.createBankLedgerRecord)
    .get(BankLedgerController_1.getAllBankLedgerRecords);
router.route("/balance")
    .get(BankLedgerController_1.getBankBalanceRecord);
router.route("/:id")
    .get(BankLedgerController_1.getBankLedgerRecordById)
    .patch(BankLedgerController_1.updateBankLedgerRecord)
    .delete(BankLedgerController_1.deleteBankLedgerRecord);
exports.default = router;
