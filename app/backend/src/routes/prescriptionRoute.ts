import express from "express";
import {
  createPrescriptionRecord,
  getAllPrescriptionRecords,
  getPrescriptionRecordById,
  updatePrescriptionRecord,
  deletePrescriptionRecord,
} from "../controllers/PrescriptionController";

const router = express.Router();

router.route("/")
  .post(createPrescriptionRecord)
  .get(getAllPrescriptionRecords);

router.route("/:id")
  .get(getPrescriptionRecordById)
  .patch(updatePrescriptionRecord)
  .delete(deletePrescriptionRecord);

export default router;