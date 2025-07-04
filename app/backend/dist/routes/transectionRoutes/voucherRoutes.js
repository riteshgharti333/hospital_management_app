"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VoucherController_1 = require("../../controllers/transection/VoucherController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router.route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, VoucherController_1.createVoucherRecord)
    .get(VoucherController_1.getAllVoucherRecords);
router.route("/:id")
    .get(VoucherController_1.getVoucherRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, VoucherController_1.updateVoucherRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, VoucherController_1.deleteVoucherRecord);
exports.default = router;
