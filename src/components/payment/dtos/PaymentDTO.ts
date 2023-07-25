import { injectable } from 'inversify';
import {
  ICreatePayment,
  IPayment,
  IPaymentDTO,
  IPaymentInitiate,
  IPaymentVerification,
  IVerifyAccountNumber,
} from 'payment';

export const PAYMENT_DTO = Symbol('PaymentDTO');

@injectable()
export class PaymentDTO implements IPaymentDTO {
  public initiatePayment(payload: IPaymentInitiate): IPaymentInitiate {
    const { email, amount, userId, paymentType, meta, callBackUrl, recipientId } = payload;

    return {
      email,
      amount,
      userId,
      recipientId,
      paymentType,
      meta,
      callBackUrl,
    };
  }

  public create(payload: ICreatePayment): Partial<IPayment> {
    const {
      paymentProvider,
      paymentReference,
      recipientId,
      paymentUrl,
      email,
      userId,
      amount,
      accessCode,
      paymentType,
      meta,
    } = payload;

    return {
      paymentProvider,
      paymentReference,
      paymentUrl,
      email,
      userId,
      amount,
      recipientId,
      accessCode,
      paymentType,
      meta,
    };
  }

  public verifyPaymentDTO(payload: IPaymentVerification): IPaymentVerification {
    const { reference, email } = payload;

    return {
      reference,
      email,
    };
  }

  public verifyAccountNumber(payload: IVerifyAccountNumber): IVerifyAccountNumber {
    const { accountNumber, bankCode } = payload;

    return {
      accountNumber,
      bankCode,
    };
  }
}
