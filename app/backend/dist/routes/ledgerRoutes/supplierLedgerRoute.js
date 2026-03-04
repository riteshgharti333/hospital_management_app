"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SupplierLedgerController_1 = require("../../controllers/ledger/SupplierLedgerController");
// import { isAuthenticated } from "../../middlewares/isAuthenticated";
// import { isAdmin } from "../../middlewares/isAdmin";
const router = express_1.default.Router();
// router.route("/")
//   .post(isAuthenticated, isAdmin, createSupplierLedgerRecord)
//   .get(getAllSupplierLedgerRecords);
router.route("/outstanding").get(SupplierLedgerController_1.getSupplierOutstandingBalance);
router.route("/summary").get(SupplierLedgerController_1.getSupplierSummaryReport);
// router.route("/:id")
//   .get(getSupplierLedgerRecordById)
//   .patch(isAuthenticated, isAdmin, updateSupplierLedgerRecord)
//   .delete(isAuthenticated, isAdmin, deleteSupplierLedgerRecord);
exports.default = router;
