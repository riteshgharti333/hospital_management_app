"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BedAssignController_1 = require("../controllers/BedAssignController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BedAssignController_1.createBedAssignmentRecord)
    .get(BedAssignController_1.getAllBedAssignmentRecords);
// SEARCH
router.get("/search", BedAssignController_1.searchBedAssignmentResults);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(BedAssignController_1.getBedAssignmentRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BedAssignController_1.updateBedAssignmentRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BedAssignController_1.deleteBedAssignmentRecord);
// DISCHARGE PATIENT
router.post("/:id/discharge", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BedAssignController_1.dischargePatientFromBed);
exports.default = router;
