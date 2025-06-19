"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BirthController_1 = require("../controllers/BirthController");
const router = express_1.default.Router();
router.route("/")
    .post(BirthController_1.createBirthRecord)
    .get(BirthController_1.getAllBirthRecords);
router.route("/:id")
    .get(BirthController_1.getBirthRecordById)
    .put(BirthController_1.updateBirthRecord)
    .delete(BirthController_1.deleteBirthRecord);
exports.default = router;
