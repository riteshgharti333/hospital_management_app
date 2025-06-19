import express from "express";
import {
  createExpenseRecord,
  getAllExpenseRecords,
  getExpenseRecordById,
  getExpenseSummary,
  updateExpenseRecord,
  deleteExpenseRecord,
} from "../../controllers/ledger/ExpenseLedgerController";

const router = express.Router();

router.route("/")
  .post(createExpenseRecord)
  .get(getAllExpenseRecords);

router.route("/summary")
  .get(getExpenseSummary);

router.route("/:id")
  .get(getExpenseRecordById)
  .patch(updateExpenseRecord)
  .delete(deleteExpenseRecord);

export default router;