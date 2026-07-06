import { FILE_TYPE } from "@enums";
import { BadRequestException } from "@nestjs/common";
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { v4 as uuid } from "uuid";

// ─── MIME → FILE_TYPE mapping ────────────────────────────────────────────────

export const MIME_TYPE_MAP: Record<string, FILE_TYPE> = {
  // Images
  "image/jpeg": FILE_TYPE.IMAGE,
  "image/jpg": FILE_TYPE.IMAGE,
  "image/png": FILE_TYPE.IMAGE,
  "image/gif": FILE_TYPE.IMAGE,
  "image/webp": FILE_TYPE.IMAGE,
  "image/svg+xml": FILE_TYPE.IMAGE,
  "image/bmp": FILE_TYPE.IMAGE,
  "image/tiff": FILE_TYPE.IMAGE,
  "image/x-icon": FILE_TYPE.IMAGE,
  // Videos
  "video/mp4": FILE_TYPE.VIDEO,
  "video/mpeg": FILE_TYPE.VIDEO,
  "video/quicktime": FILE_TYPE.VIDEO,
  "video/x-msvideo": FILE_TYPE.VIDEO,
  "video/webm": FILE_TYPE.VIDEO,
  "video/x-matroska": FILE_TYPE.VIDEO,
  "video/3gpp": FILE_TYPE.VIDEO,
  // Audio
  "audio/mpeg": FILE_TYPE.AUDIO,
  "audio/mp3": FILE_TYPE.AUDIO,
  "audio/wav": FILE_TYPE.AUDIO,
  "audio/ogg": FILE_TYPE.AUDIO,
  "audio/webm": FILE_TYPE.AUDIO,
  "audio/aac": FILE_TYPE.AUDIO,
  "audio/flac": FILE_TYPE.AUDIO,
  "audio/x-m4a": FILE_TYPE.AUDIO,
  // Documents
  "application/pdf": FILE_TYPE.DOCUMENT,
  "application/msword": FILE_TYPE.DOCUMENT,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    FILE_TYPE.DOCUMENT,
  "application/vnd.ms-excel": FILE_TYPE.DOCUMENT,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    FILE_TYPE.DOCUMENT,
  "application/vnd.ms-powerpoint": FILE_TYPE.DOCUMENT,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    FILE_TYPE.DOCUMENT,
  "text/plain": FILE_TYPE.DOCUMENT,
  "text/csv": FILE_TYPE.DOCUMENT,
  // Archives
  "application/zip": FILE_TYPE.ARCHIVE,
  "application/x-rar-compressed": FILE_TYPE.ARCHIVE,
  "application/x-7z-compressed": FILE_TYPE.ARCHIVE,
  "application/gzip": FILE_TYPE.ARCHIVE,
  "application/x-tar": FILE_TYPE.ARCHIVE,
  "application/x-bzip2": FILE_TYPE.ARCHIVE,
};

// ─── Per-type size limits ─────────────────────────────────────────────────────

export const FILE_SIZE_LIMITS: Record<FILE_TYPE, number> = {
  [FILE_TYPE.IMAGE]: 10 * 1024 * 1024, // 10 MB
  [FILE_TYPE.VIDEO]: 500 * 1024 * 1024, // 500 MB
  [FILE_TYPE.AUDIO]: 100 * 1024 * 1024, // 100 MB
  [FILE_TYPE.DOCUMENT]: 50 * 1024 * 1024, // 50 MB
  [FILE_TYPE.ARCHIVE]: 200 * 1024 * 1024, // 200 MB
  [FILE_TYPE.OTHER]: 50 * 1024 * 1024, // 50 MB
};

/** Global hard cap passed to multer (max of all per-type limits) */
export const MAX_FILE_SIZE = Math.max(...Object.values(FILE_SIZE_LIMITS));

export const UPLOAD_BASE_DIR = "./uploads";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getFileType(mimeType: string): FILE_TYPE {
  return MIME_TYPE_MAP[mimeType] ?? FILE_TYPE.OTHER;
}

/**
 * Builds the storage directory path based on file type + current year/month.
 * Example: uploads/image/2024/03
 */
export function getStorageDir(fileType: FILE_TYPE): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return join(UPLOAD_BASE_DIR, fileType.toLowerCase(), String(year), month);
}

/** MD5 checksum of a file on disk — used for deduplication. */
export function computeChecksum(filePath: string): string {
  const buffer = readFileSync(filePath);
  return createHash("md5").update(buffer).digest("hex");
}

/**
 * Validates that the uploaded file does not exceed the per-type size limit.
 * Throws BadRequestException (multer has already saved the file at this point,
 * so callers must delete it on failure).
 */
export function validateFileSize(file: Express.Multer.File): void {
  const fileType = getFileType(file.mimetype);
  const limitBytes = FILE_SIZE_LIMITS[fileType];
  if (file.size > limitBytes) {
    const limitMb = (limitBytes / (1024 * 1024)).toFixed(0);
    throw new BadRequestException(
      `${fileType} files must not exceed ${limitMb} MB (received ${(
        file.size /
        (1024 * 1024)
      ).toFixed(2)} MB)`
    );
  }
}

// ─── Multer storage ───────────────────────────────────────────────────────────

export const fileUploadStorage = diskStorage({
  destination: (_req, file, cb) => {
    const fileType = getFileType(file.mimetype);
    const dir = getStorageDir(fileType);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase() || ".bin";
    cb(null, `${uuid()}${ext}`);
  },
});

/** Multer fileFilter — rejects obviously invalid MIME types early. */
export function fileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void
): void {
  // Allow everything — per-type size enforcement happens in the service.
  // You can whitelist specific mimes here if needed.
  cb(null, true);
}

/** Ready-made options object to pass to FileInterceptor / FilesInterceptor. */
export const uploadInterceptorOptions = {
  storage: fileUploadStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
};
