import express from "express";
import {
  createBedRecord,
  getAllBedRecords,
  getBedRecordById,
  updateBedRecord,
  deleteBedRecord,
  searchBedResults,
} from "../controllers/BedController";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createBedRecord
  )
  .get(getAllBedRecords);

// SEARCH
router.get("/search", searchBedResults);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getBedRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateBedRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteBedRecord
  );

export default router;
