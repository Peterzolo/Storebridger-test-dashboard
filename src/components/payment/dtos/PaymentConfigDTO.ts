import { injectable } from 'inversify';
import { ICreatePaymentConfig, IPaymentConfig, IPaymentConfigDTO } from '../../../types/payment';
import { capitalizeString } from '../../../library/helpers';
import { ISetDefaultPaymentConfig } from 'payment/IPaymentDTO';

export const PAYMENT_CONFIG_DTO = Symbol('PaymentConfigDTO');

@injectable()
export class PaymentConfigDTO implements IPaymentConfigDTO {
  public create(payload: ICreatePaymentConfig): Partial<IPaymentConfig> {
    const { name, createdBy, providerCode } = payload;

    return {
      name: capitalizeString(name),
      createdBy,
      providerCode,
    };
  }

  public setDefaultPaymentConfig(payload: ISetDefaultPaymentConfig): Partial<IPaymentConfig> {
    const { paymentConfigId, updatedBy } = payload;

    return {
      id: paymentConfigId,
      updatedBy,
    };
  }
}
