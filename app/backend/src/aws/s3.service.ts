import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3.client";

export const uploadFileToS3 = async (file: Express.Multer.File) => {
  const key = `prescriptions/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    key,
    url: fileUrl,
  };
};

