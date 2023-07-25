import { FilterQuery, HydratedDocument, Model, UpdateQuery } from 'mongoose';
import { injectable, unmanaged } from 'inversify';
import { ObjectId } from 'mongodb';
import _ from 'lodash';
import { Read, Write } from '../interface';

@injectable()
export class BaseRepository<T> implements Read<T>, Write<T> {
  private _model: Model<T>;

  constructor(@unmanaged() schemaModel: Model<T>) {
    this._model = schemaModel;
  }

  async create(item: T): Promise<HydratedDocument<T>> {
    return await this._model.create(item);
  }

  async createMany(items: Array<T>): Promise<Array<HydratedDocument<T>>> {
    return await this._model.create(items);
  }

  async update(cond: FilterQuery<T>, item: UpdateQuery<T>): Promise<HydratedDocument<T> | null> {
    const queryObj = this._setQueryObj(cond);
    const doc = await this._model.findOneAndUpdate(queryObj, item);
    await doc?.save();

    return this._model.findOne(queryObj);
  }

  async updateMany(cond?: FilterQuery<T>, update?: UpdateQuery<T>): Promise<HydratedDocument<T>[] | []> {
    const queryObj = this._setQueryObj(cond);
    await this._model.updateMany(queryObj, update);
    return this._model.find(queryObj);
  }

  async delete(id: string): Promise<boolean> {
    const queryObj = this._setQueryObj({ id });
    return this._model.remove(queryObj);
  }

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    const queryObj = this._setQueryObj({ id });
    return this._model.findById(queryObj._id);
  }

  async findOne(
    cond?: FilterQuery<T>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<HydratedDocument<T> | null> {
    const queryObj = this._setQueryObj(cond);
    return this._model.findOne(queryObj, projection);
  }

  async find(
    cond?: FilterQuery<T>,
    projection?: Record<string, unknown> | string | Array<string>,
  ): Promise<Array<HydratedDocument<T>>> {
    const queryObj = this._setQueryObj(cond);

    return this._model.find(queryObj, projection).sort({ createdAt: -1 });
  }

  async findByIdList(cond?: FilterQuery<T>): Promise<Array<HydratedDocument<T>>> {
    const queryObj = this._setQueryObj(cond);

    if (queryObj.ids.length === 0) return [];

    const ids = queryObj.ids.filter((id: string) => id && id !== '');

    return this._model.find({
      _id: {
        $in: ids,
      },
    });
  }

  async findByPropertyList(cond?: FilterQuery<T>): Promise<Array<HydratedDocument<T>>> {
    if (!cond) return [];
    if (cond.value.length === 0) return [];

    const properties = cond.value.filter((id: string) => id && id !== '');

    return this._model
      .find({
        [cond.field]: {
          $in: properties,
        },
      })
      .sort({ createdAt: -1 });
  }

  private _omitIdFromQuery(query: FilterQuery<T>) {
    const cleanObj = _.partial(_.omit, _, ['id']);
    return cleanObj(query);
  }

  private _setQueryObj(cond?: FilterQuery<T>): FilterQuery<T> {
    if (!cond) return {};

    if (_.has(cond, 'id')) {
      const _id = new ObjectId(cond.id);
      const cleanedObj = this._omitIdFromQuery(cond);

      return {
        _id,
        ...cleanedObj,
      };
    }
    return cond;
  }
}
