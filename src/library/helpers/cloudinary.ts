import { v2 as cloudinary } from 'cloudinary';
import config from '../../config/index';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import logger from './logger';

cloudinary.config({
  cloud_name: config.cloudinary.cloudinaryName,
  api_key: config.cloudinary.cloudinaryApiKey,
  api_secret: config.cloudinary.cloudinaryApiSecret,
});

export const cloudinaryStorage = () => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: async (_req, file) => ({
      folder: 'Images',
      public_id: `${Date.now()}-${file.originalname}-image`,
    }),
  });
};

export const destoryCloudinaryImage = async (image: string) => {
  try {
    const response = await cloudinary.uploader.destroy(image);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw error;
  }
};
