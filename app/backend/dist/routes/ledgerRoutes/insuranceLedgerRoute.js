"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InsuranceLedgerController_1 = require("../../controllers/ledger/InsuranceLedgerController");
// import { isAuthenticated } from "../../middlewares/isAuthenticated";
// import { isAdmin } from "../../middlewares/isAdmin";
const router = express_1.default.Router();
// router.route("/")
//   .post(isAuthenticated, isAdmin, createInsuranceLedgerRecord)
//   .get(getAllInsuranceLedgerRecords);
router.route("/summary").get(InsuranceLedgerController_1.getInsuranceSummaryReport);
// router.route("/:id")
//   .get(getInsuranceLedgerRecordById)
//   .patch(isAuthenticated, isAdmin, updateInsuranceLedgerRecord)
//   .delete(isAuthenticated, isAdmin, deleteInsuranceLedgerRecord);
exports.default = router;
