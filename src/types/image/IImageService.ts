import { IDeleteImage, IImage } from './IImage';
import { ICreateImage } from './IImageDTO';

export interface IImageService {
  create(payload: Array<ICreateImage>): Promise<Array<Partial<IImage>>>;
  delete(payload: IDeleteImage): Promise<string>;
}
