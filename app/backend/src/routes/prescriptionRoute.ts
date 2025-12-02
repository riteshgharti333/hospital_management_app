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
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(
    isAuthenticated,
    isAdmin,
    uploadMiddleware.single("file"),
    createPrescriptionRecord
  )
  .get(getAllPrescriptionRecords);

router.get("/search", searchPrescriptionsResults);

router.get("/filter", filterPrescriptions);

router
  .route("/:id")
  .get(getPrescriptionRecordById)
  .patch(
    isAuthenticated,
    isAdmin,
    uploadMiddleware.single("file"),
    updatePrescriptionRecord
  )
  .delete(isAuthenticated, isAdmin, deletePrescriptionRecord);

export default router;
