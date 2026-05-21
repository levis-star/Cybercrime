import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { nanoid } from 'nanoid';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain']);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${nanoid(8)}${ext}`);
  }
});

export const uploadEvidence = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      callback(new Error('Only PNG, JPG, WEBP, PDF, and TXT evidence files are allowed'));
      return;
    }
    callback(null, true);
  }
});
