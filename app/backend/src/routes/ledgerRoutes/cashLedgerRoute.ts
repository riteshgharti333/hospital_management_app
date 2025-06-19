import express from "express";
import {
  createCashLedgerRecord,
  getAllCashLedgerRecords,
  getCashLedgerRecordById,
  getCashBalanceRecord,
  updateCashLedgerRecord,
  deleteCashLedgerRecord,
} from "../../controllers/ledger/CashLedgerController";

const router = express.Router();

router.route("/")
  .post(createCashLedgerRecord)
  .get(getAllCashLedgerRecords);

router.route("/balance")
  .get(getCashBalanceRecord);

router.route("/:id")
  .get(getCashLedgerRecordById)
  .patch(updateCashLedgerRecord)
  .delete(deleteCashLedgerRecord);

export default router;