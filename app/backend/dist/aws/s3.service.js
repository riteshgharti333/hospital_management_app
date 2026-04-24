"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_client_1 = require("./s3.client");
const uploadFileToS3 = async (file) => {
    const key = `prescriptions/${Date.now()}-${file.originalname}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    await s3_client_1.s3Client.send(command);
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return {
        key,
        url: fileUrl,
    };
};
exports.uploadFileToS3 = uploadFileToS3;
