import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IOrder, IOrderRepository } from '../../../types/order';
import { Order } from '../models';

export const ORDER_REPOSITORY = Symbol('OrderRepository');

@injectable()
export class OrderRepository extends BaseRepository<IOrder> implements IOrderRepository {
  constructor() {
    super(Order);
  }
}
