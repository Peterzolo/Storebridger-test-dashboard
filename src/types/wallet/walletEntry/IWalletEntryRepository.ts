import { Write, Read } from '../../../databases/mongodb';
import { IWalletEntry } from './IWalletEntry';

export interface IWalletEntryRepository extends Read<IWalletEntry>, Write<IWalletEntry> {}
