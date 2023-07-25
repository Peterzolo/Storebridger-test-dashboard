import { IWalletEntry } from './IWalletEntry';
import { ICreateWalletEntry, IReadWalletEntry } from './IWalletEntryDTO';

export interface IWalletEntryService {
  create(payload: ICreateWalletEntry): Promise<Partial<IWalletEntry>>;
  readMany(payload: IReadWalletEntry): Promise<Partial<IWalletEntry>[]>;
  readTransactionsByStatus(payload: IReadWalletEntry): Promise<Partial<IWalletEntry>[]>;
}
