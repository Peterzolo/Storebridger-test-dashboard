import _ from 'lodash';
import { injectable } from 'inversify';
import { IPaymentConfig, IPaymentConfigPresenter } from '../../../types/payment';

export const PAYMENT_CONFIG_PRESENTER = Symbol('PaymentConfigPresenter');

@injectable()
export class PaymentConfigPresenter implements IPaymentConfigPresenter {
  public serialize(
    paymentConfigDocument: IPaymentConfig,
    selectors: Array<keyof IPaymentConfig> = ['name', 'id'],
  ): Partial<IPaymentConfig> {
    const paymentConfigEntity = {
      id: paymentConfigDocument.id,
      createdBy: paymentConfigDocument.createdBy,
      providerCode: paymentConfigDocument.providerCode,
      isDefault: paymentConfigDocument.isDefault,
      name: paymentConfigDocument.name,
      createdAt: paymentConfigDocument.createdAt,
      updatedAt: paymentConfigDocument.updatedAt,
    };

    return _.pick(paymentConfigEntity, selectors);
  }
}
