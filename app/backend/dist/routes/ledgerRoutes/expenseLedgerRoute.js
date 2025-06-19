"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExpenseLedgerController_1 = require("../../controllers/ledger/ExpenseLedgerController");
const router = express_1.default.Router();
router.route("/")
    .post(ExpenseLedgerController_1.createExpenseRecord)
    .get(ExpenseLedgerController_1.getAllExpenseRecords);
router.route("/summary")
    .get(ExpenseLedgerController_1.getExpenseSummary);
router.route("/:id")
    .get(ExpenseLedgerController_1.getExpenseRecordById)
    .patch(ExpenseLedgerController_1.updateExpenseRecord)
    .delete(ExpenseLedgerController_1.deleteExpenseRecord);
exports.default = router;
