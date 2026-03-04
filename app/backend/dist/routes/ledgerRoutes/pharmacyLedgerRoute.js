"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PharmacyLedgerController_1 = require("../../controllers/ledger/PharmacyLedgerController");
// import { isAuthenticated } from "../../middlewares/isAuthenticated";
// import { isAdmin } from "../../middlewares/isAdmin";
const router = express_1.default.Router();
// router.route("/")
//   .post(isAuthenticated, isAdmin, createPharmacyLedgerRecord)
//   .get(getAllPharmacyLedgerRecords);
router.route("/summary/financial").get(PharmacyLedgerController_1.getPharmacyFinancialSummary);
router.route("/summary/category").get(PharmacyLedgerController_1.getPharmacyCategorySummary);
// router.route("/:id")
//   .get(getPharmacyLedgerRecordById)
//   .patch(isAuthenticated, isAdmin, updatePharmacyLedgerRecord)
//   .delete(isAuthenticated, isAdmin, deletePharmacyLedgerRecord);
exports.default = router;
