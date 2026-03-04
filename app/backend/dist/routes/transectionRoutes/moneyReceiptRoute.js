"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MoneyReceiptController_1 = require("../../controllers/transection/MoneyReceiptController");
// 🔥 extra ../ added (deep folder fix)
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), MoneyReceiptController_1.createMoneyReceiptRecord)
    .get(MoneyReceiptController_1.getAllMoneyReceiptRecords);
// SEARCH & FILTER
router.get("/search", MoneyReceiptController_1.searchMoneyReceiptResults);
router.get("/filter", MoneyReceiptController_1.filterMoneyReceipts);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(MoneyReceiptController_1.getMoneyReceiptRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), MoneyReceiptController_1.updateMoneyReceiptRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), MoneyReceiptController_1.deleteMoneyReceiptRecord);
exports.default = router;
