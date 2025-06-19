"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NurseController_1 = require("../controllers/NurseController");
const router = express_1.default.Router();
router.route("/")
    .post(NurseController_1.createNurseRecord)
    .get(NurseController_1.getAllNurseRecords);
router.route("/:id")
    .get(NurseController_1.getNurseRecordById)
    .patch(NurseController_1.updateNurseRecord)
    .delete(NurseController_1.deleteNurseRecord);
exports.default = router;
