import express from "express";
import {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  searchAdmissionsResults,
  filterAdmissions,
} from "../controllers/AdmissionController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router.post("/", isAuthenticated, isAdmin, createAdmission);
router.get("/", getAllAdmissions);
router.get("/search", searchAdmissionsResults);
router.get("/filter", filterAdmissions);

router.get("/:id", getAdmissionById);
router.put("/:id", isAuthenticated, isAdmin, updateAdmission);
router.delete("/:id", isAuthenticated, isAdmin, deleteAdmission);

export default router;
