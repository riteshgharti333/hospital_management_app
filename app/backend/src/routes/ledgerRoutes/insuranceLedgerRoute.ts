import express from "express";
import {
  createInsuranceLedgerRecord,
  getAllInsuranceLedgerRecords,
  getInsuranceLedgerRecordById,
  getInsuranceSummaryReport,
  updateInsuranceLedgerRecord,
  deleteInsuranceLedgerRecord,
} from "../../controllers/ledger/InsuranceLedgerController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router.route("/")
  .post(isAuthenticated, isAdmin, createInsuranceLedgerRecord)
  .get(getAllInsuranceLedgerRecords);

router.route("/summary").get(getInsuranceSummaryReport);

router.route("/:id")
  .get(getInsuranceLedgerRecordById)
  .patch(isAuthenticated, isAdmin, updateInsuranceLedgerRecord)
  .delete(isAuthenticated, isAdmin, deleteInsuranceLedgerRecord);

export default router;
