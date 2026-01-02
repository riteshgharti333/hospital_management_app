import express from "express";
import {
  createNurseRecord,
  getAllNurseRecords,
  getNurseRecordById,
  updateNurseRecord,
  deleteNurseRecord,
  searchNurseResults,
  filterNurses,
} from "../controllers/NurseController";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createNurseRecord
  )
  .get(getAllNurseRecords);

// SEARCH & FILTER
router.get("/search", searchNurseResults);
router.get("/filter", filterNurses);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getNurseRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateNurseRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteNurseRecord
  );

export default router;
