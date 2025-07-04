"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BirthController_1 = require("../controllers/BirthController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BirthController_1.createBirthRecord)
    .get(BirthController_1.getAllBirthRecords);
router
    .route("/:id")
    .get(BirthController_1.getBirthRecordById)
    .put(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BirthController_1.updateBirthRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BirthController_1.deleteBirthRecord);
exports.default = router;
