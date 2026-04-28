import express from "express";
import {
  createAppointmentRecord,
  getAllAppointmentRecords,
  getAppointmentRecordById,
  updateAppointmentRecord,
  deleteAppointmentRecord,
  cancelAppointmentRecord,
  searchAppointmentResults,
  filterAppointments,
  runExpiredAppointmentsUpdate,
} from "../controllers/AppointmentController";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN", "RECEPTIONIST"), // Add roles as needed
    createAppointmentRecord
  )
  .get(getAllAppointmentRecords);

// SEARCH & FILTER
router.get("/search", searchAppointmentResults);
router.get("/filter", filterAppointments);

// Admin endpoint to manually update expired appointments
router.post(
  "/expired/update",
  authenticateUser,
  authorizeRoles("ADMIN"),
  runExpiredAppointmentsUpdate
);


// Cancel appointment (PATCH is more RESTful for status change)
router.patch(
  "/:id/cancel",
  authenticateUser,
  cancelAppointmentRecord
);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getAppointmentRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN", "RECEPTIONIST"),
    updateAppointmentRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteAppointmentRecord
  );

export default router;