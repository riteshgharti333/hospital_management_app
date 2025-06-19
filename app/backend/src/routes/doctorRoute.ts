import express from "express";
import {
  createDoctorRecord,
  getAllDoctorRecords,
  getDoctorRecordById,
  updateDoctorRecord,
  deleteDoctorRecord,
} from "../controllers/DoctorController";

const router = express.Router();

router.route("/")
  .post(createDoctorRecord)
  .get(getAllDoctorRecords);

router.route("/:id")
  .get(getDoctorRecordById)
  .patch(updateDoctorRecord)
  .delete(deleteDoctorRecord);

export default router;