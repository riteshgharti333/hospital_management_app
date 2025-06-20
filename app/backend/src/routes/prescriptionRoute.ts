import express from "express";
import {
  createPrescriptionRecord,
  getAllPrescriptionRecords,
  getPrescriptionRecordById,
  updatePrescriptionRecord,
  deletePrescriptionRecord,
} from "../controllers/PrescriptionController";
import { uploadMiddleware } from "../middlewares/multer.middleware"; 

const router = express.Router();

router.route("/")
  .post(uploadMiddleware.single("file"), createPrescriptionRecord) 
  .get(getAllPrescriptionRecords);

router.route("/:id")
  .get(getPrescriptionRecordById)
  .patch(uploadMiddleware.single("file"), updatePrescriptionRecord) 
  .delete(deletePrescriptionRecord);

export default router;
