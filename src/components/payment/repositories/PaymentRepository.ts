import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IPayment, IPaymentRepository } from '../../../types/payment';
import { Payment } from '../models';

export const PAYMENT_REPOSITORY = Symbol('PaymentRepository');

@injectable()
export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor() {
    super(Payment);
  }
}
