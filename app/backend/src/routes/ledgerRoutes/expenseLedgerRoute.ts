import express from "express";
import {
  createExpenseRecord,
  getAllExpenseRecords,
  getExpenseRecordById,
  getExpenseSummary,
  updateExpenseRecord,
  deleteExpenseRecord,
} from "../../controllers/ledger/ExpenseLedgerController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router.route("/")
  .post(isAuthenticated, isAdmin, createExpenseRecord)
  .get(getAllExpenseRecords);

router.route("/summary").get(getExpenseSummary);

router.route("/:id")
  .get(getExpenseRecordById)
  .patch(isAuthenticated, isAdmin, updateExpenseRecord)
  .delete(isAuthenticated, isAdmin, deleteExpenseRecord);

export default router;
