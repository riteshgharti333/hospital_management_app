import express from "express";
import {
  createCashLedgerRecord,
  getAllCashLedgerRecords,
  getCashLedgerRecordById,
  getCashBalanceRecord,
  updateCashLedgerRecord,
  deleteCashLedgerRecord,
  searchCashLedgerResults,
  filterCashLedger,
} from "../../controllers/ledger/CashLedgerController";

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
    createCashLedgerRecord
  )
  .get(getAllCashLedgerRecords);

// BALANCE (read-only)
router.get("/balance", getCashBalanceRecord);

// SEARCH & FILTER
router.get("/search", searchCashLedgerResults);
router.get("/filter", filterCashLedger);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getCashLedgerRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateCashLedgerRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteCashLedgerRecord
  );

export default router;
