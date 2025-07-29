import express from "express";
import {
  createAmbulanceRecord,
  getAllAmbulanceRecords,
  getAmbulanceRecordById,
  updateAmbulanceRecord,
  deleteAmbulanceRecord,
  searchAmbulanceResults,
} from "../controllers/AmbulanceController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createAmbulanceRecord)
  .get(getAllAmbulanceRecords);

router.get("/search", searchAmbulanceResults);

router
  .route("/:id")
  .get(getAmbulanceRecordById)
  .patch(isAuthenticated, isAdmin, updateAmbulanceRecord)
  .delete(isAuthenticated, isAdmin, deleteAmbulanceRecord);

export default router;
