"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PharmacistController_1 = require("../controllers/PharmacistController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PharmacistController_1.createPharmacistRecord)
    .get(PharmacistController_1.getAllPharmacistRecords);
router
    .route("/:id")
    .get(PharmacistController_1.getPharmacistRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PharmacistController_1.updatePharmacistRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PharmacistController_1.deletePharmacistRecord);
exports.default = router;
