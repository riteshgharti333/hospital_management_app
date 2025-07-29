import express from "express";
import {
  createPharmacistRecord,
  getAllPharmacistRecords,
  getPharmacistRecordById,
  updatePharmacistRecord,
  deletePharmacistRecord,
  searchPharmacistResults,
} from "../controllers/PharmacistController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createPharmacistRecord)
  .get(getAllPharmacistRecords);

router.get("/search", searchPharmacistResults);

router
  .route("/:id")
  .get(getPharmacistRecordById)
  .patch(isAuthenticated, isAdmin, updatePharmacistRecord)
  .delete(isAuthenticated, isAdmin, deletePharmacistRecord);

export default router;
