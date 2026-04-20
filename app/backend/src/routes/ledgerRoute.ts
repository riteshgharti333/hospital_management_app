import express from "express";
import {
  createLedgerRecord,
  getAllLedgerRecords,
  getLedgerRecordById,
  updateLedgerRecord,
  deleteLedgerRecord,
  searchLedgerResults,
  filterLedgers,
  getLedgersByEntityRecord,
} from "../controllers/LedgerController";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE
router.post(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN", "ACCOUNTANT"),
  createLedgerRecord
);

// LIST
router.get("/", getAllLedgerRecords);

// SEARCH & FILTER
router.get("/search", searchLedgerResults);
router.get("/filter", filterLedgers);

// GET LEDGERS BY ENTITY
router.get("/:entityType", getLedgersByEntityRecord);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getLedgerRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN", "ACCOUNTANT"),
    updateLedgerRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteLedgerRecord
  );

export default router;