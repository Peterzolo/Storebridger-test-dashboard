import { IWalletEntry } from './IWalletEntry';

export interface IWalletEntryPresenter {
  serialize(walletEntryDocument: IWalletEntry, selectors: Array<keyof IWalletEntry>): Partial<IWalletEntry>;
}
