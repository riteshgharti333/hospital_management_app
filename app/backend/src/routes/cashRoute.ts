import express from "express";
import {
  createCashAccountRecord,
  getAllCashAccountRecords,
  getCashAccountRecordById,
  updateCashAccountRecord,
  deleteCashAccountRecord,
  searchCashAccountResults,
  filterCashAccounts,
} from "../controllers/CashControllers";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE
router.post(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  createCashAccountRecord,
);

// LIST
router.get("/", getAllCashAccountRecords);

// SEARCH & FILTER
router.get("/search", searchCashAccountResults);
router.get("/filter", filterCashAccounts);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getCashAccountRecordById)
  .put(authenticateUser, authorizeRoles("ADMIN"), updateCashAccountRecord)
  .delete(authenticateUser, authorizeRoles("ADMIN"), deleteCashAccountRecord);

export default router;
