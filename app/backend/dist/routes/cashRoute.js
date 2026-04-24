"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CashControllers_1 = require("../controllers/CashControllers");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE
router.post("/", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), CashControllers_1.createCashAccountRecord);
// LIST
router.get("/", CashControllers_1.getAllCashAccountRecords);
// SEARCH & FILTER
router.get("/search", CashControllers_1.searchCashAccountResults);
router.get("/filter", CashControllers_1.filterCashAccounts);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(CashControllers_1.getCashAccountRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), CashControllers_1.updateCashAccountRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), CashControllers_1.deleteCashAccountRecord);
exports.default = router;
