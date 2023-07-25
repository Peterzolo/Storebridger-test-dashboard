export interface IPaymentConfig {
  id?: string;
  name: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  providerCode: string;
  updatedBy?: string;
  createdBy: string;
}

export interface IPaymentInitiate {
  amount: number;
  email: string;
  userId: string;
  paymentType: PaymentType;
  recipientId?: string;
  callBackUrl?: string;
  meta?: Map<string, string>;
}

export interface IPayment {
  id?: string;
  email: string;
  userId: string;
  amount: number;
  recipientId: string;
  isVerified: boolean;
  paymentUrl: string;
  paymentReference?: string;
  accessCode?: string;
  paymentProvider?: string;
  paymentProviderStatus?: string;
  status: PaymentStatus;
  paymentType: PaymentType;
  meta: Map<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PaymentStatus {
  FAILED = 'FAILED',
  PROCESSED = 'PROCESSED',
  PROCESSING = 'PROCESSING',
  UNKNOWN = 'UNKNOWN',
}

export enum PaymentType {
  WALLET = 'WALLET',
  CONTRACT = 'CONTRACT',
}

export interface IPaymentUrl {
  email: string;
  amount: number;
  paymentUrl: string;
}
