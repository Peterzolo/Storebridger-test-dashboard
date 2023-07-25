import { Request, Response, NextFunction } from 'express';
import { logger, BadRequestError } from '../helpers';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { cloudinaryStorage } from '../helpers';
import { i18n, translations } from '../../locales/i18n';

const multerUpload = multer({
  storage: cloudinaryStorage(),
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ext = path.extname(`${file.originalname}`);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
});

export const imageUpload = (upload: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    multerUpload.array(upload, 5)(req, res, (err) => {
      if (req.files?.length === 0) {
        logger.error(`${req}`);
        next(new BadRequestError(i18n.t(translations.image.create.validation.image.required)));
      }
      if (err) {
        logger.error(`${req.method} ${req.baseUrl}${req.url} => ${err.message}`);
        next(new BadRequestError(err.message));
      }

      if (req.files?.length !== 0) {
        const files = req.files as Express.Multer.File[];
        for (const file of files) {
          logger.info(`uploaded image ${JSON.stringify(file)}`);
        }
      }
      next();
    });
  };
};
