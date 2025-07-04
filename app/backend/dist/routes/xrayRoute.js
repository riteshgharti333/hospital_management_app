"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const XrayController_1 = require("../controllers/XrayController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, XrayController_1.createXrayReportRecord)
    .get(XrayController_1.getAllXrayReportRecords);
router
    .route("/summary/financial")
    .get(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, XrayController_1.getFinancialSummaryReport);
router
    .route("/summary/doctor-wise")
    .get(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, XrayController_1.getDoctorWiseSummaryReport);
router
    .route("/:id")
    .get(XrayController_1.getXrayReportRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, XrayController_1.updateXrayReportRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, XrayController_1.deleteXrayReportRecord);
exports.default = router;
