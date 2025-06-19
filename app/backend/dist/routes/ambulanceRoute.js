"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AmbulanceController_1 = require("../controllers/AmbulanceController");
const router = express_1.default.Router();
router.route("/")
    .post(AmbulanceController_1.createAmbulanceRecord)
    .get(AmbulanceController_1.getAllAmbulanceRecords);
router.route("/:id")
    .get(AmbulanceController_1.getAmbulanceRecordById)
    .patch(AmbulanceController_1.updateAmbulanceRecord)
    .delete(AmbulanceController_1.deleteAmbulanceRecord);
exports.default = router;
