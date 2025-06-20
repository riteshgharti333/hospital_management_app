import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory buffer for streaming to cloud
const limits = { fileSize: 10 * 1024 * 1024 }; // Max 10MB

export const uploadMiddleware = multer({ storage, limits });

