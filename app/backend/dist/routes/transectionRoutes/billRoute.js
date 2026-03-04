"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BillController_1 = require("../../controllers/transection/BillController");
// 🔥 extra ../ added here
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BillController_1.createBillRecord)
    .get(BillController_1.getAllBillRecords);
// SEARCH & FILTER
router.get("/search", BillController_1.searchBillsResults);
router.get("/filter", BillController_1.filterBills);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(BillController_1.getBillRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BillController_1.updateBillRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BillController_1.deleteBillRecord);
exports.default = router;
