import { injectable } from 'inversify';
import { IImageDTO, IImage, ICreateImage, IDeleteImage } from '../../../types/image';

export const IMAGE_DTO = Symbol('ImageDTO');

@injectable()
export class ImageDTO implements IImageDTO {
  public create(images: Array<ICreateImage>): Array<Partial<IImage>> {
    return images.map((image) => {
      const { size, format, path, createdBy, fileName } = image;

      return {
        size,
        format,
        path,
        createdBy,
        fileName,
      };
    });
  }

  public delete(image: IDeleteImage): IDeleteImage {
    return {
      imageUrl: image.imageUrl,
    };
  }
}
