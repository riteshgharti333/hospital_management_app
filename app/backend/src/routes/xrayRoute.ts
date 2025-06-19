import express from "express";
import {
  createXrayReportRecord,
  getAllXrayReportRecords,
  getXrayReportRecordById,
  getFinancialSummaryReport,
  getDoctorWiseSummaryReport,
  updateXrayReportRecord,
  deleteXrayReportRecord,
} from "../controllers/XrayController";

const router = express.Router();

router.route("/")
  .post(createXrayReportRecord)
  .get(getAllXrayReportRecords);

router.route("/summary/financial")
  .get(getFinancialSummaryReport);

router.route("/summary/doctor-wise")
  .get(getDoctorWiseSummaryReport);

router.route("/:id")
  .get(getXrayReportRecordById)
  .patch(updateXrayReportRecord)
  .delete(deleteXrayReportRecord);

export default router;