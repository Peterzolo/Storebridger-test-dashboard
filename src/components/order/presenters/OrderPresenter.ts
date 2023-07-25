import _ from 'lodash';
import { injectable } from 'inversify';
import { IOrder, IOrderPresenter } from '../../../types/order';

export const ORDER_PRESENTER = Symbol('OrderPresenter');

@injectable()
export class OrderPresenter implements IOrderPresenter {
  public serialize(orderDocument: IOrder, selectors: Array<keyof IOrder> = ['id']): Partial<IOrder> {
    const orderEntity = {
      id: orderDocument.id,
      title: orderDocument.title,
      avatar: orderDocument.avatar,
      contractId: orderDocument.contractId,
      createdBy: orderDocument.createdBy,
      createdAt: orderDocument.createdAt,
      updatedAt: orderDocument.updatedAt,
      totalAmount: orderDocument.totalAmount,
      sellerId: orderDocument.sellerId,
      buyerId: orderDocument.buyerId,
      totalQuantity: orderDocument.totalQuantity,
      lastModifiedBy: orderDocument.lastModifiedBy,
      status: orderDocument.status,
    };

    return _.pick(orderEntity, selectors);
  }
}
