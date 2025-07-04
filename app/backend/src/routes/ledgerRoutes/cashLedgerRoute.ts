import express from "express";
import {
  createCashLedgerRecord,
  getAllCashLedgerRecords,
  getCashLedgerRecordById,
  getCashBalanceRecord,
  updateCashLedgerRecord,
  deleteCashLedgerRecord,
} from "../../controllers/ledger/CashLedgerController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createCashLedgerRecord)
  .get(getAllCashLedgerRecords);

router.route("/balance").get(getCashBalanceRecord);

router
  .route("/:id")
  .get(getCashLedgerRecordById)
  .patch(isAuthenticated, isAdmin, updateCashLedgerRecord)
  .delete(isAuthenticated, isAdmin, deleteCashLedgerRecord);

export default router;
