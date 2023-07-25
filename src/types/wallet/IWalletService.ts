import { ICreditWallet, IDebitWallet, IWallet, IWalletPaymentUrl } from './IWallet';
import { ICreateWallet, IGetWalletPaymentUrl, IReadWallet, IWalletPayment } from './IWalletDTO';

export interface IWalletService {
  read(query: IReadWallet): Promise<Partial<IWallet> | null>;
  get(query: { userEmail: string }): Promise<Partial<IWallet>>;
  getCreditWalletPaymentUrl(payload: IGetWalletPaymentUrl): Promise<IWalletPaymentUrl>;
  creditWallet(payload: ICreditWallet): Promise<Partial<IWallet>>;
  debitWallet(payload: IDebitWallet): Promise<Partial<IWallet>>;
  createWallet(payload: ICreateWallet): Promise<Partial<IWallet>>;
  getWalletStatus(query: { userEmail: string }): Promise<Record<string, boolean>>;
  walletPayment(payload: IWalletPayment): Promise<Partial<IWallet>>;
}
