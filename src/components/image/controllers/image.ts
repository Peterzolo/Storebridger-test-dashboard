import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { IMAGE_SERVICE } from '../services';
import { IImageService } from '../../../types/image';
import inversifyContainer from '../../../ioc/inversify.config';
import { i18n } from '../../../locales/i18n';

const container = inversifyContainer();
const imageService = container.get<IImageService>(IMAGE_SERVICE);

export const postCreateImage = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const files = req.files as Array<Express.Multer.File>;

  const images = files.map((file) => {
    return {
      size: file.size,
      creatorEmail: req.email,
      format: file.mimetype,
      path: file.path,
      fileName: file.filename,
    };
  });

  const outcome = await imageService.create(images);

  return new SuccessResponse(i18n.t('image.create.successResponse.created'), outcome).send(res);
};

export const deleteImage = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await imageService.delete({ ...req.body });

  return new SuccessResponse(i18n.t('image.delete.successResponse.deleted'), outcome).send(res);
};
