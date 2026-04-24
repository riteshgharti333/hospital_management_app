"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BankControllers_1 = require("../controllers/BankControllers");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE
router.post("/", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BankControllers_1.createBankAccountRecord);
// LIST
router.get("/", BankControllers_1.getAllBankAccountRecords);
// SEARCH & FILTER
router.get("/search", BankControllers_1.searchBankAccountResults);
router.get("/filter", BankControllers_1.filterBankAccounts);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(BankControllers_1.getBankAccountRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BankControllers_1.updateBankAccountRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BankControllers_1.deleteBankAccountRecord);
exports.default = router;
