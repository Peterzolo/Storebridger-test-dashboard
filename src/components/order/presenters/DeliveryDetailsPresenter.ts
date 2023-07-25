import _ from 'lodash';
import { injectable } from 'inversify';
import { IDeliveryDetails, IDeliveryDetailsPresenter } from '../../../types/order';

export const DELIVERY_DETAILS_PRESENTER = Symbol('DeliveryDetailsPresenter');

@injectable()
export class DeliveryDetailsPresenter implements IDeliveryDetailsPresenter {
  public serialize(
    document: IDeliveryDetails,
    selectors: Array<keyof IDeliveryDetails> = ['id'],
  ): Partial<IDeliveryDetails> {
    const deliveryEntity = {
      id: document.id,
      recipientPhoneNumber: document.recipientPhoneNumber,
      orderId: document.orderId,
      deliveryChargeToBuyer: document.deliveryChargeToBuyer,
      deliveryFee: document.deliveryFee,
      deliveryAddress: document.deliveryAddress,
      deliveryDate: document.deliveryDate,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };

    return selectors.length > 0 ? _.pick(deliveryEntity, selectors) : deliveryEntity;
  }
}
