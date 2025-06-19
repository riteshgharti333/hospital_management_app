import express from "express";
import {
  createBankLedgerRecord,
  getAllBankLedgerRecords,
  getBankLedgerRecordById,
  getBankBalanceRecord,
  updateBankLedgerRecord,
  deleteBankLedgerRecord,
} from "../../controllers/ledger/BankLedgerController";

const router = express.Router();

router.route("/")
  .post(createBankLedgerRecord)
  .get(getAllBankLedgerRecords);

router.route("/balance")
  .get(getBankBalanceRecord);

router.route("/:id")
  .get(getBankLedgerRecordById)
  .patch(updateBankLedgerRecord)
  .delete(deleteBankLedgerRecord);

export default router;