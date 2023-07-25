import { UpdateQuery, FilterQuery, HydratedDocument } from 'mongoose';

export interface Write<T> {
  create: (item: T) => Promise<HydratedDocument<T>>;
  createMany: (items: Array<T>) => Promise<Array<HydratedDocument<T>>>;
  update: (cond: FilterQuery<T>, item: UpdateQuery<T>) => Promise<HydratedDocument<T> | null>;
  updateMany: (cond?: FilterQuery<T>, update?: UpdateQuery<T>) => Promise<HydratedDocument<T>[] | []>;
  delete: (id: string) => Promise<boolean>;
}
