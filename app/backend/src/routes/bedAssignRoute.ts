import express from "express";
import {
  createBedAssignmentRecord,
  getAllBedAssignmentRecords,
  getBedAssignmentRecordById,
  updateBedAssignmentRecord,
  dischargePatientFromBed,
  deleteBedAssignmentRecord,
  searchBedAssignmentResults,
} from "../controllers/BedAssignController";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createBedAssignmentRecord
  )
  .get(getAllBedAssignmentRecords);

// SEARCH
router.get("/search", searchBedAssignmentResults);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getBedAssignmentRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateBedAssignmentRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteBedAssignmentRecord
  );

// DISCHARGE PATIENT
router.post(
  "/:id/discharge",
  authenticateUser,
  authorizeRoles("ADMIN"),
  dischargePatientFromBed
);

export default router;
