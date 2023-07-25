import { IWalletEntryStatus } from './walletEntry/IWalletEntry';

export interface IWallet {
  id: string;
  userId: string;
  balance: number;
  pin: string;
}
export interface ICreditWallet {
  userId: string;
  amount: number;
  reference: string;
  contractId?: string;
  recipientId?: string;
  userEmail?: string;
  status: IWalletEntryStatus;
}
export interface IDebitWallet {
  userId: string;
  userEmail: string;
  amount: number;
  bankCode: string;
  accountNumber: string;
}

export interface IWalletPaymentUrl {
  email: string;
  amount: number;
  paymentUrl: string;
}
