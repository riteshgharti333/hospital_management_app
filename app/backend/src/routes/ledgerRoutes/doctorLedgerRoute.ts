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
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createDoctorLedgerRecord)
  .get(getAllDoctorLedgerRecords);

router.route("/balance").get(getDoctorBalanceRecord);

router.get("/search", searchDoctorLedgerResults);

router.get("/filter", filterDoctorLedger);

router
  .route("/:id")
  .get(getDoctorLedgerRecordById)
  .patch(isAuthenticated, isAdmin, updateDoctorLedgerRecord)
  .delete(isAuthenticated, isAdmin, deleteDoctorLedgerRecord);

export default router;
