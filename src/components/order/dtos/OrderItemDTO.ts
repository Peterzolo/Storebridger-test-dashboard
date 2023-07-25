import { injectable } from 'inversify';
import {
  ICreateOrderItem,
  ICreateOrderItems,
  IOrderItem,
  IOrderItemDTO,
  IReadOrderItem,
  IUpdateOrderItem,
} from 'order';

export const ORDER_ITEM_DTO = Symbol('OrderItemDTO');

@injectable()
export class OrderItemDTO implements IOrderItemDTO {
  public create(payload: ICreateOrderItem): Partial<IOrderItem> {
    return {
      orderId: payload.orderId,
      name: payload.name,
      price: Number(payload.price),
      quantity: Number(payload.quantity),
      description: payload.description,
      images: payload.images,
      condition: payload.condition,
    };
  }

  public createMany(payload: ICreateOrderItems): Array<Partial<IOrderItem>> {
    return payload.orderItems.map((item) => {
      return {
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        description: item.description,
        images: item.images,
        orderId: payload.orderId,
        condition: item.condition,
      };
    });
  }

  public read(query: IReadOrderItem): Partial<IOrderItem> {
    const { id, orderId } = query;

    return {
      ...(id && { id }),
      ...(orderId && { orderId }),
    };
  }

  public update(payload: IUpdateOrderItem): Partial<IOrderItem> {
    const { name, price, quantity, description, images, condition, status, keepClauses } = payload;

    return {
      ...(name && { name }),
      ...(price && { price }),
      ...(quantity && { quantity }),
      ...(description && { description }),
      ...(images && { images }),
      ...(condition && { condition }),
      ...(status && { status }),
      ...(keepClauses && { keepClauses }),
    };
  }
}
