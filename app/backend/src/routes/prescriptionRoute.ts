import express from "express";
import {
  createPrescriptionRecord,
  getAllPrescriptionRecords,
  getPrescriptionRecordById,
  updatePrescriptionRecord,
  deletePrescriptionRecord,
  searchPrescriptionResults,
  filterPrescriptions,
  getPrescriptionsByAdmissionId,
  uploadPrescriptionDoc,
} from "../controllers/PrescriptionController";
import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";
import { upload } from "../aws/upload.middleware";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN", "DOCTOR"),
    upload.single("prescriptionDoc"), 
    createPrescriptionRecord,
  );

router.get("/", getAllPrescriptionRecords);

// SEARCH & FILTER

router.get("/search", searchPrescriptionResults);
router.get("/filter", filterPrescriptions);

router.post(
  "/upload",
  authenticateUser,
  authorizeRoles("ADMIN", "DOCTOR"),
  upload.single("prescriptionDoc"),
  uploadPrescriptionDoc,
);

// GET PRESCRIPTIONS BY ADMISSION
router.get("/admission/:admissionId", getPrescriptionsByAdmissionId);

// GET / UPDATE / DELETE BY ID
router
  .route("/:id")
  .get(getPrescriptionRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN", "DOCTOR"),
    upload.single("prescriptionDoc"), // Add this
    updatePrescriptionRecord,
  )
  .delete(authenticateUser, authorizeRoles("ADMIN"), deletePrescriptionRecord);
export default router;
