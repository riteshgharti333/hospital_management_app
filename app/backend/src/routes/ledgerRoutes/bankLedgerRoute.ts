import express from "express";
import {
  createBankLedgerRecord,
  getAllBankLedgerRecords,
  getBankLedgerRecordById,
  getBankBalanceRecord,
  updateBankLedgerRecord,
  deleteBankLedgerRecord,
  searchBankLedgerResults,
  filterBankLedger,
} from "../../controllers/ledger/BankLedgerController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createBankLedgerRecord)
  .get(getAllBankLedgerRecords);

router.route("/balance").get(getBankBalanceRecord);

router.get("/search", searchBankLedgerResults);

router.get("/filter", filterBankLedger);
 
router
  .route("/:id")
  .get(getBankLedgerRecordById)
  .patch(isAuthenticated, isAdmin, updateBankLedgerRecord)
  .delete(isAuthenticated, isAdmin, deleteBankLedgerRecord);

export default router;
