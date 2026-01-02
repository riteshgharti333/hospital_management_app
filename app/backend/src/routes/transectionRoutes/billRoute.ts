import express from "express";
import {
  createBillRecord,
  getAllBillRecords,
  getBillRecordById,
  updateBillRecord,
  deleteBillRecord,
  searchBillsResults,
  filterBills,
} from "../../controllers/transection/BillController";

// 🔥 extra ../ added here
import { authenticateUser } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createBillRecord
  )
  .get(getAllBillRecords);

// SEARCH & FILTER
router.get("/search", searchBillsResults);
router.get("/filter", filterBills);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getBillRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateBillRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteBillRecord
  );

export default router;
