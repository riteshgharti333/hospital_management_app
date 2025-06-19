"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ServiceChargesController_1 = require("../../controllers/items/ServiceChargesController");
const router = express_1.default.Router();
router.route("/")
    .post(ServiceChargesController_1.createServiceChargeRecord)
    .get(ServiceChargesController_1.getAllServiceChargeRecords);
router.route("/:id")
    .get(ServiceChargesController_1.getServiceChargeRecordById)
    .patch(ServiceChargesController_1.updateServiceChargeRecord)
    .delete(ServiceChargesController_1.deleteServiceChargeRecord);
exports.default = router;
