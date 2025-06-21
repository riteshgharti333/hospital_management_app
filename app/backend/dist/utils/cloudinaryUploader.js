"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const stream_1 = require("stream");
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const CLOUDINARY_FOLDER = "hospital";
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_config_1.default.uploader.upload_stream({
            folder: CLOUDINARY_FOLDER,
            resource_type: "raw",
            use_filename: true,
            unique_filename: true,
        }, (error, result) => {
            if (error || !result)
                return reject(error);
            resolve(result.secure_url);
        });
        const stream = new stream_1.Readable();
        stream.push(buffer);
        stream.push(null);
        stream.pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (fileUrl) => {
    try {
        const url = new URL(fileUrl);
        // 1. Find the "/upload/" part in the URL
        const uploadIndex = url.pathname.indexOf("/upload/");
        if (uploadIndex === -1) {
            throw new Error("Invalid Cloudinary URL format - cannot find /upload/");
        }
        // 2. Get everything after /upload/ (includes version and path)
        const fullPath = url.pathname.slice(uploadIndex + "/upload/".length);
        // Example: "v1750me402281/hospital/file_rukrtl"
        // 3. Split into parts and remove the version (first part)
        const pathParts = fullPath.split('/');
        if (pathParts.length < 3) {
            throw new Error("Invalid Cloudinary URL structure");
        }
        // 4. Rejoin the remaining parts to get the public ID
        const publicId = pathParts.slice(1).join('/');
        // Result: "hospital/file_rukrtl"
        console.log("Extracted Public ID:", publicId); // For debugging
        // 5. Delete using the public ID
        const result = await cloudinary_config_1.default.uploader.destroy(publicId, {
            resource_type: "raw"
        });
        console.log("Deletion Result:", result); // For debugging
    }
    catch (error) {
        console.error("❌ Failed to delete Cloudinary file:", error);
        throw error; // Re-throw to handle in calling function
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
