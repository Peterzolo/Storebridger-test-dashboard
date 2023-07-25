import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IPaymentConfig, IPaymentConfigRepository } from '../../../types/payment';
import { PaymentConfig } from '../models';

export const PAYMENT_CONFIG_REPOSITORY = Symbol('PaymentConfigRepository');

@injectable()
export class PaymentConfigRepository extends BaseRepository<IPaymentConfig> implements IPaymentConfigRepository {
  constructor() {
    super(PaymentConfig);
  }
}
