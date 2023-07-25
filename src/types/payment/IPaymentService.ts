import { IPaystackBank } from '../../library/helpers';
import { IPayment, IPaymentConfig, IPaymentInitiate } from './IPayment';
import {
  ICreatePaymentConfig,
  ISetDefaultPaymentConfig,
  IVerifyAccountNumber,
  IVerifyAccountNumberResponse,
} from './IPaymentDTO';

export interface IPaymentConfigService {
  create(payload: ICreatePaymentConfig): Promise<Partial<IPaymentConfig>>;
  read(query: Record<string, unknown>): Promise<IPaymentConfig | null>;
  setDefultPaymentConfig(payload: ISetDefaultPaymentConfig): Promise<Partial<IPaymentConfig>>;
}

export interface IPaymentService {
  initiatePayment(payload: IPaymentInitiate): Promise<Partial<IPayment>>;
  read(query: Record<string, unknown>): Promise<IPayment | null>;
  verifyPayment(payload: { reference: string; email: string }): Promise<Partial<IPayment>>;
  getBanks(): Promise<Array<IPaystackBank>>;
  verifyAccountNumber(payload: IVerifyAccountNumber): Promise<IVerifyAccountNumberResponse>;
}
