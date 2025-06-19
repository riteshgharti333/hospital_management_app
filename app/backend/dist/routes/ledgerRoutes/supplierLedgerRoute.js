"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SupplierLedgerController_1 = require("../../controllers/ledger/SupplierLedgerController");
const router = express_1.default.Router();
router.route("/")
    .post(SupplierLedgerController_1.createSupplierLedgerRecord)
    .get(SupplierLedgerController_1.getAllSupplierLedgerRecords);
router.route("/outstanding")
    .get(SupplierLedgerController_1.getSupplierOutstandingBalance);
router.route("/summary")
    .get(SupplierLedgerController_1.getSupplierSummaryReport);
router.route("/:id")
    .get(SupplierLedgerController_1.getSupplierLedgerRecordById)
    .patch(SupplierLedgerController_1.updateSupplierLedgerRecord)
    .delete(SupplierLedgerController_1.deleteSupplierLedgerRecord);
exports.default = router;
