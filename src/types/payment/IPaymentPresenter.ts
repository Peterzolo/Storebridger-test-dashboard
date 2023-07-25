import { IPayment, IPaymentConfig } from './IPayment';

export interface IPaymentConfigPresenter {
  serialize(paymentConfigDocument: IPaymentConfig, selectors: Array<keyof IPaymentConfig>): Partial<IPaymentConfig>;
}

export interface IPaymentPresenter {
  serialize(paymentDocument: IPayment, selectors: Array<keyof IPayment>): Partial<IPayment>;
}
