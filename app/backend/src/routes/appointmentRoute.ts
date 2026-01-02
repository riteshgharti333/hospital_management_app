import express from "express";

import {
  createAppointmentRecord,
  getAllAppointmentRecords,
  getAppointmentRecordById,
  updateAppointmentRecord,
  deleteAppointmentRecord,
  searchAppointmentResults,
  filterAppointments,
} from "../controllers/AppointmentController";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createAppointmentRecord
  )
  .get(getAllAppointmentRecords);

// SEARCH & FILTER
router.get("/search", searchAppointmentResults);
router.get("/filter", filterAppointments);

// GET / UPDATE / DELETE BY ID
router
  .route("/:id")
  .get(getAppointmentRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateAppointmentRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteAppointmentRecord
  );

export default router;
