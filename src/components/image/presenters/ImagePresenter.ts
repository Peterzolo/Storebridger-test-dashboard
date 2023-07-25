import _ from 'lodash';
import { injectable } from 'inversify';
import { IImage, IImagePresenter } from '../../../types/image';

export const IMAGE_PRESENTER = Symbol('ImagePresenter');

@injectable()
export class ImagePresenter implements IImagePresenter {
  public serialize(images: Array<IImage>, selectors: string[]): Array<Partial<IImage>> {
    return images.map((image) => {
      return _.pick(
        {
          size: image.size,
          format: image.format,
          path: image.path,
          fileName: image.fileName,
        },
        selectors,
      );
    });
  }
}
