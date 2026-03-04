"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const XrayController_1 = require("../controllers/XrayController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), XrayController_1.createXrayReportRecord)
    .get(XrayController_1.getAllXrayReportRecords);
// SUMMARY REPORTS (ADMIN ONLY)
router
    .route("/summary/financial")
    .get(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), XrayController_1.getFinancialSummaryReport);
router
    .route("/summary/doctor-wise")
    .get(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), XrayController_1.getDoctorWiseSummaryReport);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(XrayController_1.getXrayReportRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), XrayController_1.updateXrayReportRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), XrayController_1.deleteXrayReportRecord);
exports.default = router;
