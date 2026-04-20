import express from "express";
import {
  createBankAccountRecord,
  getAllBankAccountRecords,
  getBankAccountRecordById,
  updateBankAccountRecord,
  deleteBankAccountRecord,
  searchBankAccountResults,
  filterBankAccounts,
} from "../controllers/BankControllers";

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE
router.post(
  "/",
  authenticateUser,
  authorizeRoles("ADMIN"),
  createBankAccountRecord,
);

// LIST
router.get("/", getAllBankAccountRecords);

// SEARCH & FILTER
router.get("/search", searchBankAccountResults);
router.get("/filter", filterBankAccounts);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getBankAccountRecordById)
  .put(authenticateUser, authorizeRoles("ADMIN"), updateBankAccountRecord)
  .delete(authenticateUser, authorizeRoles("ADMIN"), deleteBankAccountRecord);

export default router;
