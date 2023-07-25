import { IPayment, IPaymentConfig, IPaymentInitiate, PaymentType } from './IPayment';

export interface ICreatePaymentConfig {
  name: string;
  createdBy: string;
  creatorEmail: string;
  providerCode: string;
}

export interface ISetDefaultPaymentConfig {
  paymentConfigId: string;
  updaterEmail: string;
  updatedBy: string;
}

export interface IReadPaymentConfig {
  id?: string;
  isDefault?: boolean;
}

export interface IReadPayment {
  id?: string;
  paymentReference?: string;
}

export interface IUpdatePayment {
  status: 'FAILED' | 'PROCESSED' | 'PROCESSING' | 'UNKNOWN';
  isVerified: boolean;
  paymentProviderStatus: string;
  paymentReference?: string;
}

export interface IUpdatePaymentConfig {
  name?: string;
  providerCode?: string;
  isDefault?: boolean;
  updatedBy?: string;
}

export interface ICreatePayment {
  paymentUrl: string;
  paymentProvider: string;
  email: string;
  userId: string;
  amount: number;
  paymentReference: string;
  accessCode: string;
  paymentType: PaymentType;
  recipientId: string;
  meta: Map<string, string>;
}

export interface IVerifyAccountNumber {
  accountNumber: string;
  bankCode: string;
}

export interface IVerifyAccountNumberResponse {
  accountNumber: string;
  accountName: string;
  bankId: string;
}

export interface IPaymentVerification {
  reference: string;
  email: string;
}

export interface IPaymentConfigDTO {
  create(payload: ICreatePaymentConfig): Partial<IPaymentConfig>;
  setDefaultPaymentConfig(payload: ISetDefaultPaymentConfig): Partial<IPaymentConfig>;
}

export interface IPaymentDTO {
  initiatePayment(payload: IPaymentInitiate): IPaymentInitiate;
  create(payload: ICreatePayment): Partial<IPayment>;
  verifyPaymentDTO(payload: IPaymentVerification): IPaymentVerification;
  verifyAccountNumber(payload: IVerifyAccountNumber): IVerifyAccountNumber;
}
