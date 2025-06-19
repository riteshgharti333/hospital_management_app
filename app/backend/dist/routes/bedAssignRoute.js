"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BedAssignController_1 = require("../controllers/BedAssignController");
const router = express_1.default.Router();
router.route("/")
    .post(BedAssignController_1.createBedAssignmentRecord)
    .get(BedAssignController_1.getAllBedAssignmentRecords);
router.route("/:id")
    .get(BedAssignController_1.getBedAssignmentRecordById)
    .put(BedAssignController_1.updateBedAssignmentRecord)
    .delete(BedAssignController_1.deleteBedAssignmentRecord);
router.post("/:id/discharge", BedAssignController_1.dischargePatientFromBed);
exports.default = router;
