"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VoucherController_1 = require("../../controllers/transection/VoucherController");
const router = express_1.default.Router();
router.route("/")
    .post(VoucherController_1.createVoucherRecord)
    .get(VoucherController_1.getAllVoucherRecords);
router.route("/:id")
    .get(VoucherController_1.getVoucherRecordById)
    .patch(VoucherController_1.updateVoucherRecord)
    .delete(VoucherController_1.deleteVoucherRecord);
exports.default = router;
