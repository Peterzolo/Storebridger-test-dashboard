import _ from 'lodash';
import { injectable } from 'inversify';
import { IOrderItem, IOrderItemPresenter } from '../../../types/order';

export const ORDER_ITEM_PRESENTER = Symbol('OrderItemsPresenter');

@injectable()
export class OrderItemPresenter implements IOrderItemPresenter {
  public serialize(orderItemDocument: IOrderItem, selectors: Array<keyof IOrderItem> = ['id']): Partial<IOrderItem> {
    const orderEntity = {
      id: orderItemDocument.id,
      name: orderItemDocument.name,
      price: orderItemDocument.price,
      quantity: orderItemDocument.quantity,
      description: orderItemDocument.description,
      images: orderItemDocument.images,
      orderId: orderItemDocument.orderId,
      status: orderItemDocument.status,
      createdAt: orderItemDocument.createdAt,
      updatedAt: orderItemDocument.updatedAt,
    };

    return selectors.length > 0 ? _.pick(orderEntity, selectors) : orderEntity;
  }
}
