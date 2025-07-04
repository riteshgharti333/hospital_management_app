"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InsuranceLedgerController_1 = require("../../controllers/ledger/InsuranceLedgerController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router.route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, InsuranceLedgerController_1.createInsuranceLedgerRecord)
    .get(InsuranceLedgerController_1.getAllInsuranceLedgerRecords);
router.route("/summary").get(InsuranceLedgerController_1.getInsuranceSummaryReport);
router.route("/:id")
    .get(InsuranceLedgerController_1.getInsuranceLedgerRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, InsuranceLedgerController_1.updateInsuranceLedgerRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, InsuranceLedgerController_1.deleteInsuranceLedgerRecord);
exports.default = router;
