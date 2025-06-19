"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DoctorLedgerController_1 = require("../../controllers/ledger/DoctorLedgerController");
const router = express_1.default.Router();
router.route("/")
    .post(DoctorLedgerController_1.createDoctorLedgerRecord)
    .get(DoctorLedgerController_1.getAllDoctorLedgerRecords);
router.route("/balance")
    .get(DoctorLedgerController_1.getDoctorBalanceRecord);
router.route("/:id")
    .get(DoctorLedgerController_1.getDoctorLedgerRecordById)
    .patch(DoctorLedgerController_1.updateDoctorLedgerRecord)
    .delete(DoctorLedgerController_1.deleteDoctorLedgerRecord);
exports.default = router;
