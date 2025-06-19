"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const XrayController_1 = require("../controllers/XrayController");
const router = express_1.default.Router();
router.route("/")
    .post(XrayController_1.createXrayReportRecord)
    .get(XrayController_1.getAllXrayReportRecords);
router.route("/summary/financial")
    .get(XrayController_1.getFinancialSummaryReport);
router.route("/summary/doctor-wise")
    .get(XrayController_1.getDoctorWiseSummaryReport);
router.route("/:id")
    .get(XrayController_1.getXrayReportRecordById)
    .patch(XrayController_1.updateXrayReportRecord)
    .delete(XrayController_1.deleteXrayReportRecord);
exports.default = router;
