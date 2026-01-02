import express from "express";
import {
  createBirthRecord,
  getBirthRecordById,
  updateBirthRecord,
  deleteBirthRecord,
  searchBirthResults,
  getAllBirth,
  filterBirths,
} from "../controllers/BirthController";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createBirthRecord
  )
  .get(getAllBirth);

// SEARCH & FILTER
router.get("/search", searchBirthResults);
router.get("/filter", filterBirths);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getBirthRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateBirthRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteBirthRecord
  );

export default router;
