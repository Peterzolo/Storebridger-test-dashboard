import { IDeleteImage, IImage } from './IImage';

export interface ICreateImage {
  size: number;
  format: string;
  fileName: string;
  path: string;
  createdBy?: string;
  creatorEmail: string;
}
export interface IImageDTO {
  create(payload: Array<ICreateImage>): Array<Partial<IImage>>;
  delete(payload: IDeleteImage): IDeleteImage;
}
