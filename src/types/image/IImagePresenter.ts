import { IImage } from './IImage';

export interface IImagePresenter {
  serialize(imageDocument: Array<IImage>, selectors: string[]): Array<Partial<IImage>>;
}
