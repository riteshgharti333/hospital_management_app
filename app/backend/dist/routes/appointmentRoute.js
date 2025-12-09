"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppointmentController_1 = require("../controllers/AppointmentController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, AppointmentController_1.createAppointmentRecord)
    .get(AppointmentController_1.getAllAppointmentRecords);
router.get("/search", AppointmentController_1.searchAppointmentResults);
router.get("/filter", AppointmentController_1.filterAppointments);
router
    .route("/:id")
    .get(AppointmentController_1.getAppointmentRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, AppointmentController_1.updateAppointmentRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, AppointmentController_1.deleteAppointmentRecord);
exports.default = router;
