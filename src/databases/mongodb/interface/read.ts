import { FilterQuery, HydratedDocument } from 'mongoose';

export interface Read<T> {
  findById: (id: string) => Promise<HydratedDocument<T> | null>;

  findOne(
    cond?: FilterQuery<T>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<HydratedDocument<T> | null>;

  find(
    cond?: FilterQuery<T>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<Array<HydratedDocument<T>>>;

  findByIdList(cond?: FilterQuery<T>): Promise<Array<HydratedDocument<T>>>;

  findByPropertyList(cond?: FilterQuery<T>): Promise<Array<HydratedDocument<T>>>;

  // find(
  //   cond?: FilterQuery<T>,
  //   projection?: Record<string, unknown> | string | Array<string>,
  //   sort?: Record<string, unknown> | string | Array<string>,
  //   limit?: number,
  // ): Promise<Query<Document<T>[], T>>;
}
