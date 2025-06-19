"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmployeeController_1 = require("../../controllers/transection/EmployeeController");
const router = express_1.default.Router();
router.route("/")
    .post(EmployeeController_1.createEmployeeRecord)
    .get(EmployeeController_1.getAllEmployeeRecords);
router.route("/:id")
    .get(EmployeeController_1.getEmployeeRecordById)
    .patch(EmployeeController_1.updateEmployeeRecord)
    .delete(EmployeeController_1.deleteEmployeeRecord);
exports.default = router;
