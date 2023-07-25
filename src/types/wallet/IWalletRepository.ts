import { Write, Read } from '../../databases/mongodb';
import { IWallet } from './IWallet';

export interface IWalletRepository extends Read<IWallet>, Write<IWallet> {}
