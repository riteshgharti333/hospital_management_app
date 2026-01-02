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

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createXrayReportRecord
  )
  .get(getAllXrayReportRecords);

// SUMMARY REPORTS (ADMIN ONLY)
router
  .route("/summary/financial")
  .get(
    authenticateUser,
    authorizeRoles("ADMIN"),
    getFinancialSummaryReport
  );

router
  .route("/summary/doctor-wise")
  .get(
    authenticateUser,
    authorizeRoles("ADMIN"),
    getDoctorWiseSummaryReport
  );

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getXrayReportRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateXrayReportRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteXrayReportRecord
  );

export default router;
