import express from "express";
import {
  createPharmacistRecord,
  getAllPharmacistRecords,
  getPharmacistRecordById,
  updatePharmacistRecord,
  deletePharmacistRecord,
  searchPharmacistResults,
} from "../controllers/PharmacistController";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createPharmacistRecord
  )
  .get(getAllPharmacistRecords);

// SEARCH
router.get("/search", searchPharmacistResults);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getPharmacistRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updatePharmacistRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deletePharmacistRecord
  );

export default router;
