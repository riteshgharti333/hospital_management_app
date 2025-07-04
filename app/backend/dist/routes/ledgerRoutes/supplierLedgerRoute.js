"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SupplierLedgerController_1 = require("../../controllers/ledger/SupplierLedgerController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router.route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, SupplierLedgerController_1.createSupplierLedgerRecord)
    .get(SupplierLedgerController_1.getAllSupplierLedgerRecords);
router.route("/outstanding").get(SupplierLedgerController_1.getSupplierOutstandingBalance);
router.route("/summary").get(SupplierLedgerController_1.getSupplierSummaryReport);
router.route("/:id")
    .get(SupplierLedgerController_1.getSupplierLedgerRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, SupplierLedgerController_1.updateSupplierLedgerRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, SupplierLedgerController_1.deleteSupplierLedgerRecord);
exports.default = router;
