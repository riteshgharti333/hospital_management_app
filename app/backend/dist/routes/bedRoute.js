"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BedController_1 = require("../controllers/BedController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BedController_1.createBedRecord)
    .get(BedController_1.getAllBedRecords);
router.get("/search", BedController_1.searchBedResults);
router
    .route("/:id")
    .get(BedController_1.getBedRecordById)
    .put(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BedController_1.updateBedRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BedController_1.deleteBedRecord);
exports.default = router;
