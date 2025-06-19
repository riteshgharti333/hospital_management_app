import express from "express";
import {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
} from "../controllers/AdmissionController";

const router = express.Router();

router.route("/").post(createAdmission).get(getAllAdmissions);

router
  .route("/:id")
  .get(getAdmissionById)
  .put(updateAdmission)
  .delete(deleteAdmission);

export default router;
