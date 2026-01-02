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

// 🔥 extra ../ for deep folder
import { authenticateUser } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createBankLedgerRecord
  )
  .get(getAllBankLedgerRecords);

// BALANCE (read-only)
router.get("/balance", getBankBalanceRecord);

// SEARCH & FILTER
router.get("/search", searchBankLedgerResults);
router.get("/filter", filterBankLedger);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getBankLedgerRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateBankLedgerRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteBankLedgerRecord
  );

export default router;
