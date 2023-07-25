import { IWallet } from './IWallet';

export interface IWalletPresenter {
  serialize(walletDocument: IWallet, selectors: Array<keyof IWallet>): Partial<IWallet>;
}
