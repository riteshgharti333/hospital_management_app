import express from "express";

import {
  createAppointmentRecord,
  getAllAppointmentRecords,
  getAppointmentRecordById,
  updateAppointmentRecord,
  deleteAppointmentRecord,
} from "../controllers/AppointmentController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createAppointmentRecord)
  .get(getAllAppointmentRecords);

router
  .route("/:id")
  .get(getAppointmentRecordById)
  .patch(isAuthenticated, isAdmin, updateAppointmentRecord)
  .delete(isAuthenticated, isAdmin, deleteAppointmentRecord);

export default router;
