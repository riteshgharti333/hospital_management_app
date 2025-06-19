"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admission = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const admissionSchema = new mongoose_1.Schema({
    admissionDate: {
        type: Date,
        required: [true, "Admission date is required"],
    },
    admissionTime: {
        type: String,
        required: [true, "Admission time is required"],
    },
    dischargeDate: {
        type: Date,
    },
    gsRsRegNo: {
        type: String,
        required: [true, "GS/RS Reg No is required"],
        unique: true,
    },
    wardNo: {
        type: String,
        required: [true, "Ward number is required"],
    },
    bedNo: {
        type: String,
        required: [true, "Bed number is required"],
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required: [true, "Blood group is required"],
    },
    aadhaarNo: {
        type: String,
        required: [true, "Aadhaar number is required"],
        validate: {
            validator: function (v) {
                return /^\d{12}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid Aadhaar number!`,
        },
    },
    urnNo: {
        type: String,
        required: [true, "URN number is required"],
        unique: true,
    },
    patientName: {
        type: String,
        required: [true, "Patient name is required"],
        trim: true,
    },
    patientAge: {
        type: Number,
        required: [true, "Patient age is required"],
        min: [0, "Age cannot be negative"],
    },
    patientSex: {
        type: String,
        enum: ["male", "female", "other"],
        required: [true, "Patient sex is required"],
    },
    guardianType: {
        type: String,
        required: [true, "Guardian type is required"],
    },
    guardianName: {
        type: String,
        required: [true, "Guardian name is required"],
        trim: true,
    },
    phoneNo: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    patientAddress: {
        type: String,
        required: [true, "Patient address is required"],
    },
    bodyWeight: {
        type: Number,
        required: [true, "Body weight is required"],
        min: [0, "Weight cannot be negative"],
    },
    bodyHeight: {
        type: Number,
        required: [true, "Body height is required"],
        min: [0, "Height cannot be negative"],
    },
    literacy: {
        type: String,
        required: [true, "Literacy status is required"],
    },
    occupation: {
        type: String,
        required: [true, "Occupation is required"],
    },
    admissionUnderDoctor: {
        type: String,
        required: [true, "Admitting doctor name is required"],
    },
    isDeliveryAdmission: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["active", "discharged", "transferred"],
        default: "active",
    },
}, { timestamps: true });
exports.Admission = mongoose_1.default.model("Admission", admissionSchema);
