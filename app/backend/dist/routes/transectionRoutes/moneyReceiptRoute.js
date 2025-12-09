"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MoneyReceiptController_1 = require("../../controllers/transection/MoneyReceiptController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, MoneyReceiptController_1.createMoneyReceiptRecord)
    .get(MoneyReceiptController_1.getAllMoneyReceiptRecords);
router.get("/search", MoneyReceiptController_1.searchMoneyReceiptResults);
router.get("/filter", MoneyReceiptController_1.filterMoneyReceipts);
router.get("/revenue", MoneyReceiptController_1.getRevenueAnalyticsData);
router.get("/analytics/payment-modes", MoneyReceiptController_1.getPaymentModeBreakdown);
router
    .route("/:id")
    .get(MoneyReceiptController_1.getMoneyReceiptRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, MoneyReceiptController_1.updateMoneyReceiptRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, MoneyReceiptController_1.deleteMoneyReceiptRecord);
exports.default = router;
