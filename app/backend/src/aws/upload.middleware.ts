import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // important for S3
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
