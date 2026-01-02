import express from "express";
import {
  createLedgerEntryRecord,
  getAllPatientLedgerEntryRecords,
  getLedgerEntryRecordById,
  updateLedgerEntryRecord,
  deleteLedgerEntryRecord,
  searchPatientLedgerResults,
  filterPatientLedger,
} from "../../controllers/ledger/PatientLedgerController";

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
    createLedgerEntryRecord
  )
  .get(getAllPatientLedgerEntryRecords);

// SEARCH & FILTER
router.get("/search", searchPatientLedgerResults);
router.get("/filter", filterPatientLedger);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getLedgerEntryRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateLedgerEntryRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteLedgerEntryRecord
  );

export default router;
