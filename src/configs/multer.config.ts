import { diskStorage } from 'multer';

export const multerStorage = diskStorage({
  destination: './uploads',

  filename: (_req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(20))
      .join('');
    cb(null, `${randomName}-${file.originalname}`);
  },
});
