"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NurseController_1 = require("../controllers/NurseController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, NurseController_1.createNurseRecord)
    .get(NurseController_1.getAllNurseRecords);
router
    .route("/:id")
    .get(NurseController_1.getNurseRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, NurseController_1.updateNurseRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, NurseController_1.deleteNurseRecord);
exports.default = router;
