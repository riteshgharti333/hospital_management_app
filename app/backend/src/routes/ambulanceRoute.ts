import express from "express";
import {
  createAmbulanceRecord,
  getAllAmbulanceRecords,
  getAmbulanceRecordById,
  updateAmbulanceRecord,
  deleteAmbulanceRecord,
  searchAmbulanceResults,
} from "../controllers/AmbulanceController";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createAmbulanceRecord
  )
  .get(getAllAmbulanceRecords);

// SEARCH
router.get("/search", searchAmbulanceResults);

// GET / UPDATE / DELETE BY ID
router
  .route("/:id")
  .get(getAmbulanceRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateAmbulanceRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteAmbulanceRecord
  );

export default router;
