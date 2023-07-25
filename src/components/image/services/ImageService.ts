import { inject, injectable } from 'inversify';
import { IImageDTO, IImagePresenter, IImage, ICreateImage, IImageService, IDeleteImage } from '../../../types/image';
import { IMAGE_DTO } from '../dtos';
import { IMAGE_PRESENTER } from '../presenters';
import { BadRequestError, destoryCloudinaryImage, logger } from '../../../library/helpers';
import { i18n } from '../../../locales/i18n';

export const IMAGE_SERVICE = Symbol('ImageService');

@injectable()
export class ImageService implements IImageService {
  public constructor(
    @inject(IMAGE_DTO) private readonly imageDTO: IImageDTO,
    @inject(IMAGE_PRESENTER) private readonly imagePresenter: IImagePresenter,
  ) {}

  public async create(images: Array<ICreateImage>): Promise<Array<Partial<IImage>>> {
    const dto = this.imageDTO.create(images);

    logger.info(`dto payload ${JSON.stringify(dto)}`);

    return this.imagePresenter.serialize(dto as Array<IImage>, ['path', 'size', 'format', 'fileName']);
  }

  public async delete(image: IDeleteImage): Promise<string> {
    const dto = this.imageDTO.delete(image);

    const response = await destoryCloudinaryImage(dto.imageUrl);

    if (response.result !== 'ok') throw new BadRequestError(i18n.t('image.delete.errorResponses.failed'));

    return i18n.t('image.delete.successResponse.created');
  }
}
