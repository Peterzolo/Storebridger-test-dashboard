import { injectable } from 'inversify';
import {
  ICreateDeliveryDetails,
  IDeliveryDetails,
  IDeliveryDetailsDTO,
  IUpdateDeliveryDetails,
} from '../../../types/order';

export const DELIVERY_DETAILS_DTO = Symbol('DeliveryDTO');

@injectable()
export class DeliveryDetailsDTO implements IDeliveryDetailsDTO {
  public create(payload: ICreateDeliveryDetails): Partial<IDeliveryDetails> {
    const {
      orderId,
      deliveryChargeToBuyer,
      deliveryFee,
      deliveryAddress,
      createdBy,
      deliveryDate,
      hasFlexibleDeliveryDate,
      recipientPhoneNumber,
    } = payload;

    return {
      orderId,
      deliveryChargeToBuyer,
      deliveryFee,
      deliveryAddress,
      createdBy,
      deliveryDate,
      hasFlexibleDeliveryDate,
      recipientPhoneNumber,
    };
  }

  public update(payload: IUpdateDeliveryDetails): Partial<IDeliveryDetails> {
    const {
      deliveryChargeToBuyer,
      deliveryFee,
      deliveryAddress,
      deliveryDate,
      hasFlexibleDeliveryDate,
      recipientPhoneNumber,
    } = payload;

    return {
      ...(deliveryChargeToBuyer && { deliveryChargeToBuyer }),
      ...(deliveryFee && { deliveryFee }),
      ...(deliveryAddress && { deliveryAddress }),
      ...(recipientPhoneNumber && { recipientPhoneNumber }),
      ...(deliveryDate && { deliveryDate }),
      ...(hasFlexibleDeliveryDate && { hasFlexibleDeliveryDate }),
    };
  }
}
