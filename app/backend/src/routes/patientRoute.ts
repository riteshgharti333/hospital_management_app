import express from "express";
import {
  createPatientRecord,
  getAllPatientRecords,
  getPatientRecordById,
  updatePatientRecord,
  deletePatientRecord,
} from "../controllers/PatientController";

const router = express.Router();

router.route("/")
  .post(createPatientRecord)
  .get(getAllPatientRecords);

router.route("/:id")
  .get(getPatientRecordById)
  .put(updatePatientRecord)
  .delete(deletePatientRecord);



export default router;