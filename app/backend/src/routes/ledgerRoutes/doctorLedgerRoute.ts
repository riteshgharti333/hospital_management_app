import express from "express";
import {
  createDoctorLedgerRecord,
  getAllDoctorLedgerRecords,
  getDoctorLedgerRecordById,
  getDoctorBalanceRecord,
  updateDoctorLedgerRecord,
  deleteDoctorLedgerRecord,
  searchDoctorLedgerResults,
  filterDoctorLedger,
} from "../../controllers/ledger/DoctorLedgerController";

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
    createDoctorLedgerRecord
  )
  .get(getAllDoctorLedgerRecords);

// BALANCE (read-only)
router.get("/balance", getDoctorBalanceRecord);

// SEARCH & FILTER
router.get("/search", searchDoctorLedgerResults);
router.get("/filter", filterDoctorLedger);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getDoctorLedgerRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateDoctorLedgerRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteDoctorLedgerRecord
  );

export default router;
