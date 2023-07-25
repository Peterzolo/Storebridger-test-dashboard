import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IOrderItem, IOrderItemRepository } from '../../../types/order';
import { OrderItem } from '../models';

export const ORDER_ITEM_REPOSITORY = Symbol('OrderItemRepository');

@injectable()
export class OrderItemRepository extends BaseRepository<IOrderItem> implements IOrderItemRepository {
  constructor() {
    super(OrderItem);
  }
}
