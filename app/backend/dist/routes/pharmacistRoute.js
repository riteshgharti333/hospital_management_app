"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PharmacistController_1 = require("../controllers/PharmacistController");
const router = express_1.default.Router();
router.route("/")
    .post(PharmacistController_1.createPharmacistRecord)
    .get(PharmacistController_1.getAllPharmacistRecords);
router.route("/:id")
    .get(PharmacistController_1.getPharmacistRecordById)
    .patch(PharmacistController_1.updatePharmacistRecord)
    .delete(PharmacistController_1.deletePharmacistRecord);
exports.default = router;
