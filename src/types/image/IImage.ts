import { Date } from 'mongoose';

export interface IImage {
  id: string;
  size: number;
  format: string;
  path: string;
  fileName: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeleteImage {
  imageUrl: string;
}
