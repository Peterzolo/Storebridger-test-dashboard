import { IWallet } from './IWallet';

export interface ICreateWallet {
  userEmail?: string;
  userId: string;
  pin: string;
}
export interface IGetWalletPaymentUrl {
  userId: string;
  amount: number;
  callBackUrl?: string;
  userEmail?: string;
}

export interface IReadWallet {
  userId?: string;
  id?: string;
}

export interface IUpdateWallet {
  balance?: number;
  pin?: string;
}

export interface IUpdateWalletDTO {
  userId: string;
  amount: number;
  userEmail?: string;
}

export interface IWalletPayment {
  userEmail?: string;
  userId: string;
  amount: number;
  contractId: string;
  pin: string;
}

export interface IWalletDTO {
  create(payload: ICreateWallet): Partial<IWallet>;
  getWalletPaymentUrl(payload: IGetWalletPaymentUrl): IGetWalletPaymentUrl;
  updateWalletDTO(payload: IUpdateWalletDTO): IUpdateWalletDTO;
  walletPaymentDTO(payload: IWalletPayment): IWalletPayment;
}
