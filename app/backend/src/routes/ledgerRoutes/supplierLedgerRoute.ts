import express from "express";
import {
  createSupplierLedgerRecord,
  getAllSupplierLedgerRecords,
  getSupplierLedgerRecordById,
  getSupplierOutstandingBalance,
  getSupplierSummaryReport,
  updateSupplierLedgerRecord,
  deleteSupplierLedgerRecord,
} from "../../controllers/ledger/SupplierLedgerController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router.route("/")
  .post(isAuthenticated, isAdmin, createSupplierLedgerRecord)
  .get(getAllSupplierLedgerRecords);

router.route("/outstanding").get(getSupplierOutstandingBalance);
router.route("/summary").get(getSupplierSummaryReport);

router.route("/:id")
  .get(getSupplierLedgerRecordById)
  .patch(isAuthenticated, isAdmin, updateSupplierLedgerRecord)
  .delete(isAuthenticated, isAdmin, deleteSupplierLedgerRecord);

export default router;
