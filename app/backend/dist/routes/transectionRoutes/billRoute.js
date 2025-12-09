"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BillController_1 = require("../../controllers/transection/BillController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BillController_1.createBillRecord)
    .get(BillController_1.getAllBillRecords);
router.get("/search", BillController_1.searchBillsResults);
router.get("/filter", BillController_1.filterBills);
router.get("/bill-status-analytics", BillController_1.getBillStatusAnalyticsRecord);
router.get("/analytics/billing-vs-receipt", BillController_1.getMonthlyBillingVsReceiptRecord);
router.get("/analytics/status", BillController_1.getBillsByStatus);
router
    .route("/:id")
    .get(BillController_1.getBillRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BillController_1.updateBillRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BillController_1.deleteBillRecord);
exports.default = router;
