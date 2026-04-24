"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LedgerController_1 = require("../controllers/LedgerController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE
router.post("/", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN", "ACCOUNTANT"), LedgerController_1.createLedgerRecord);
// LIST ALL
router.get("/", LedgerController_1.getAllLedgerRecords);
// SEARCH & FILTER
router.get("/:entityType/search", LedgerController_1.searchLedgerResultsByEntity);
router.get("/:entityType/filter", LedgerController_1.filterLedgers);
// GET LEDGERS BY ENTITY
router.get("/entity/:entityType", LedgerController_1.getLedgersByEntityRecord);
// GET BY ID
router.get("/:id", LedgerController_1.getLedgerRecordById);
// UPDATE BY ID
router.put("/:id", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN", "ACCOUNTANT"), LedgerController_1.updateLedgerRecord);
// DELETE BY ID
router.delete("/:id", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), LedgerController_1.deleteLedgerRecord);
exports.default = router;
