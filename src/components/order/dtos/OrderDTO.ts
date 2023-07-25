import { injectable } from 'inversify';
import { OrderStatus } from '../utils/constants';
import { ICreateOrder, ICreateRecipient, IOrder, IOrderDTO } from '../../../types/order';

export const ORDER_DTO = Symbol('OrderDTO');

@injectable()
export class OrderDTO implements IOrderDTO {
  public create(payload: ICreateOrder): Partial<IOrder> {
    const { contractId, orderItems, createdBy } = payload;
    const title = orderItems.map((item) => item.name).join(', ');
    const avatar = orderItems[0].images[0];

    return {
      avatar,
      title,
      contractId: contractId,
      sellerId: payload.sellerId,
      buyerId: payload.buyerId,
      totalAmount: orderItems.reduce(
        (total, orderItem) => Number(total) + Number(orderItem.price) * Number(orderItem.quantity),
        0,
      ),
      createdBy: createdBy,
      totalQuantity: orderItems.reduce((total, orderItem) => total + orderItem.quantity, 0),
      orderItems: orderItems,
      status: OrderStatus.PROCESSING,
    };
  }

  public createRecipient(payload: ICreateRecipient): Partial<IOrder> {
    const { order, contractId, recipientId } = payload;

    return {
      contractId,
      ...(order?.sellerId && { buyerId: recipientId }),
      ...(order?.buyerId && { sellerId: recipientId }),
    };
  }
}
