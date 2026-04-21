import express from "express";
import {
  createLedgerRecord,
  getAllLedgerRecords,
  getLedgerRecordById,
  updateLedgerRecord,
  deleteLedgerRecord,
  searchLedgerResultsByEntity,
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
  createLedgerRecord,
); 

// LIST ALL
router.get("/", getAllLedgerRecords);

// SEARCH & FILTER
router.get("/:entityType/search", searchLedgerResultsByEntity);
router.get("/:entityType/filter", filterLedgers);

// GET LEDGERS BY ENTITY
router.get("/entity/:entityType", getLedgersByEntityRecord);

// GET BY ID
router.get("/:id", getLedgerRecordById);

// UPDATE BY ID
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN", "ACCOUNTANT"),
  updateLedgerRecord,
);

// DELETE BY ID
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("ADMIN"),
  deleteLedgerRecord,
);

export default router;