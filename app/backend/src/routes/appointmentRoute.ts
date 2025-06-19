import express from "express";
import {
  createAppointmentRecord,
  getAllAppointmentRecords,
  getAppointmentRecordById,
  updateAppointmentRecord,
  deleteAppointmentRecord,
} from "../controllers/AppointmentController";

const router = express.Router();

router.route("/")
  .post(createAppointmentRecord)
  .get(getAllAppointmentRecords);

router.route("/:id")
  .get(getAppointmentRecordById)
  .patch(updateAppointmentRecord)
  .delete(deleteAppointmentRecord);

export default router; 