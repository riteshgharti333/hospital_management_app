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
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createXrayReportRecord)
  .get(getAllXrayReportRecords);

router
  .route("/summary/financial")
  .get(isAuthenticated, isAdmin, getFinancialSummaryReport);

router
  .route("/summary/doctor-wise")
  .get(isAuthenticated, isAdmin, getDoctorWiseSummaryReport);

router
  .route("/:id")
  .get(getXrayReportRecordById)
  .patch(isAuthenticated, isAdmin, updateXrayReportRecord)
  .delete(isAuthenticated, isAdmin, deleteXrayReportRecord);

export default router;
