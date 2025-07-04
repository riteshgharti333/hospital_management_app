"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ServiceChargesController_1 = require("../../controllers/items/ServiceChargesController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, ServiceChargesController_1.createServiceChargeRecord)
    .get(ServiceChargesController_1.getAllServiceChargeRecords);
router
    .route("/:id")
    .get(ServiceChargesController_1.getServiceChargeRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, ServiceChargesController_1.updateServiceChargeRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, ServiceChargesController_1.deleteServiceChargeRecord);
exports.default = router;
