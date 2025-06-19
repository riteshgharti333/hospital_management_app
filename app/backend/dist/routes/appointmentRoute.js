"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppointmentController_1 = require("../controllers/AppointmentController");
const router = express_1.default.Router();
router.route("/")
    .post(AppointmentController_1.createAppointmentRecord)
    .get(AppointmentController_1.getAllAppointmentRecords);
router.route("/:id")
    .get(AppointmentController_1.getAppointmentRecordById)
    .patch(AppointmentController_1.updateAppointmentRecord)
    .delete(AppointmentController_1.deleteAppointmentRecord);
exports.default = router;
