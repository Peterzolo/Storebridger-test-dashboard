import { Read, Write } from '../../databases/mongodb';
import { IPayment, IPaymentConfig } from './IPayment';

export interface IPaymentConfigRepository extends Read<IPaymentConfig>, Write<IPaymentConfig> {}

export interface IPaymentRepository extends Read<IPayment>, Write<IPayment> {}
