"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DoctorLedgerController_1 = require("../../controllers/ledger/DoctorLedgerController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DoctorLedgerController_1.createDoctorLedgerRecord)
    .get(DoctorLedgerController_1.getAllDoctorLedgerRecords);
router.route("/balance").get(DoctorLedgerController_1.getDoctorBalanceRecord);
router.get("/search", DoctorLedgerController_1.searchDoctorLedgerResults);
router.get("/filter", DoctorLedgerController_1.filterDoctorLedger);
router
    .route("/:id")
    .get(DoctorLedgerController_1.getDoctorLedgerRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DoctorLedgerController_1.updateDoctorLedgerRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DoctorLedgerController_1.deleteDoctorLedgerRecord);
exports.default = router;
