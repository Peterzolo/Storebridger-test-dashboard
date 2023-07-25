import { ContainerModule, interfaces } from 'inversify';
import { IImageService, IImagePresenter, IImageDTO } from '../../../types/image';
import { IMAGE_DTO, ImageDTO } from '../dtos';
import { IMAGE_PRESENTER, ImagePresenter } from '../presenters';
import { IMAGE_SERVICE, ImageService } from '../services';

export default () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind<IImageDTO>(IMAGE_DTO).to(ImageDTO);
    bind<IImageService>(IMAGE_SERVICE).to(ImageService).inSingletonScope();
    bind<IImagePresenter>(IMAGE_PRESENTER).to(ImagePresenter);
  });
};
