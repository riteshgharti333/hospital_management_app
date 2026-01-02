import express from "express";
import {
  createPrescriptionRecord,
  getAllPrescriptionRecords,
  getPrescriptionRecordById,
  updatePrescriptionRecord,
  deletePrescriptionRecord,
  searchPrescriptionsResults,
  filterPrescriptions,
} from "../controllers/PrescriptionController";

import { uploadMiddleware } from "../middlewares/multer.middleware";
import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    uploadMiddleware.single("file"),
    createPrescriptionRecord
  )
  .get(getAllPrescriptionRecords);

// SEARCH & FILTER
router.get("/search", searchPrescriptionsResults);
router.get("/filter", filterPrescriptions);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getPrescriptionRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    uploadMiddleware.single("file"),
    updatePrescriptionRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deletePrescriptionRecord
  );

export default router;
