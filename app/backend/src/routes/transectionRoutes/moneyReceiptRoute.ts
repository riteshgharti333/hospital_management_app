import express from "express";
import {
  createMoneyReceiptRecord,
  getAllMoneyReceiptRecords,
  getMoneyReceiptRecordById,
  updateMoneyReceiptRecord,
  deleteMoneyReceiptRecord,
  searchMoneyReceiptResults,
  filterMoneyReceipts,
} from "../../controllers/transection/MoneyReceiptController";

// 🔥 extra ../ added (deep folder fix)
import { authenticateUser } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createMoneyReceiptRecord
  )
  .get(getAllMoneyReceiptRecords);

// SEARCH & FILTER
router.get("/search", searchMoneyReceiptResults);
router.get("/filter", filterMoneyReceipts);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getMoneyReceiptRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateMoneyReceiptRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteMoneyReceiptRecord
  );

export default router;
