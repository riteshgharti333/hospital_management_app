"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExpenseLedgerController_1 = require("../../controllers/ledger/ExpenseLedgerController");
// import { isAuthenticated } from "../../middlewares/isAuthenticated";
// import { isAdmin } from "../../middlewares/isAdmin";
const router = express_1.default.Router();
// router.route("/")
//   .post(isAuthenticated, isAdmin, createExpenseRecord)
//   .get(getAllExpenseRecords);
router.route("/summary").get(ExpenseLedgerController_1.getExpenseSummary);
// router.route("/:id")
//   .get(getExpenseRecordById)
//   .patch(isAuthenticated, isAdmin, updateExpenseRecord)
//   .delete(isAuthenticated, isAdmin, deleteExpenseRecord);
exports.default = router;
