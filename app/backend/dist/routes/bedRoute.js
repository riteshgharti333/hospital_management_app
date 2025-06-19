"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BedController_1 = require("../controllers/BedController");
const router = express_1.default.Router();
router.route("/")
    .post(BedController_1.createBedRecord)
    .get(BedController_1.getAllBedRecords);
router.route("/:id")
    .get(BedController_1.getBedRecordById)
    .put(BedController_1.updateBedRecord)
    .delete(BedController_1.deleteBedRecord);
exports.default = router;
