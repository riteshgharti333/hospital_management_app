"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AmbulanceController_1 = require("../controllers/AmbulanceController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, AmbulanceController_1.createAmbulanceRecord)
    .get(AmbulanceController_1.getAllAmbulanceRecords);
router
    .route("/:id")
    .get(AmbulanceController_1.getAmbulanceRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, AmbulanceController_1.updateAmbulanceRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, AmbulanceController_1.deleteAmbulanceRecord);
exports.default = router;
