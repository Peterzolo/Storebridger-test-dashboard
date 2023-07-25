import _ from 'lodash';
import { injectable } from 'inversify';
import { IPayment, IPaymentPresenter } from '../../../types/payment';

export const PAYMENT_PRESENTER = Symbol('PaymentPresenter');

@injectable()
export class PaymentPresenter implements IPaymentPresenter {
  public serialize(paymentDocument: IPayment, selectors: (keyof IPayment)[]): Partial<IPayment> {
    const paymentEntity = {
      id: paymentDocument.id,
      email: paymentDocument.email,
      userId: paymentDocument.userId,
      amount: paymentDocument.amount,
      status: paymentDocument.status,
      paymentProviderStatus: paymentDocument.paymentProviderStatus,
      paymentUrl: paymentDocument.paymentUrl,
      paymentReference: paymentDocument.paymentReference,
    };

    return _.pick(paymentEntity, selectors);
  }
}
