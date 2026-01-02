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
import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";


const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createAdmission
  )
  .get(getAllAdmissions);

// SEARCH & FILTER
router.get("/search", searchAdmissionsResults);
router.get("/filter", filterAdmissions);

// GET / UPDATE / DELETE BY ID
router
  .route("/:id")
  .get(getAdmissionById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateAdmission
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteAdmission
  );

export default router;
