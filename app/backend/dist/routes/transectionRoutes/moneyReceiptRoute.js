"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MoneyReceiptController_1 = require("../../controllers/transection/MoneyReceiptController");
const router = express_1.default.Router();
router.route("/")
    .post(MoneyReceiptController_1.createMoneyReceiptRecord)
    .get(MoneyReceiptController_1.getAllMoneyReceiptRecords);
router.route("/:id")
    .get(MoneyReceiptController_1.getMoneyReceiptRecordById)
    .patch(MoneyReceiptController_1.updateMoneyReceiptRecord)
    .delete(MoneyReceiptController_1.deleteMoneyReceiptRecord);
exports.default = router;
