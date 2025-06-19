"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BillController_1 = require("../../controllers/transection/BillController");
const router = express_1.default.Router();
router.route("/")
    .post(BillController_1.createBillRecord)
    .get(BillController_1.getAllBillRecords);
router.route("/:id")
    .get(BillController_1.getBillRecordById)
    .patch(BillController_1.updateBillRecord)
    .delete(BillController_1.deleteBillRecord);
exports.default = router;
