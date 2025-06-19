"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PharmacyLedgerController_1 = require("../../controllers/ledger/PharmacyLedgerController");
const router = express_1.default.Router();
router.route("/")
    .post(PharmacyLedgerController_1.createPharmacyLedgerRecord)
    .get(PharmacyLedgerController_1.getAllPharmacyLedgerRecords);
router.route("/summary/financial")
    .get(PharmacyLedgerController_1.getPharmacyFinancialSummary);
router.route("/summary/category")
    .get(PharmacyLedgerController_1.getPharmacyCategorySummary);
router.route("/:id")
    .get(PharmacyLedgerController_1.getPharmacyLedgerRecordById)
    .patch(PharmacyLedgerController_1.updatePharmacyLedgerRecord)
    .delete(PharmacyLedgerController_1.deletePharmacyLedgerRecord);
exports.default = router;
